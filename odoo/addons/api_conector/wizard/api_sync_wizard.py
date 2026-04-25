from odoo import models, fields, api, _
from odoo.exceptions import UserError
import requests

class ApiSyncWizard(models.TransientModel):
    _name = 'api.sync.wizard'
    _description = 'Asistente de Sincronización API'

    sync_type = fields.Selection([
        ('centro', 'Centro Docente'),
        ('docente', 'Personal Docente'),
        ('alumno', 'Alumnos'),
        ('asistencia', 'Asistencias'),
        ('tarea', 'Tareas FCT')
    ], string="Tipo de Sincronización", required=True)

    centro_id = fields.Many2one(
        'res.partner', 
        string="Centro Docente", 
        domain=[('x_cod_centro', '!=', False)]
    )
    
    alumno_id = fields.Many2one(
        'res.partner', 
        string="Alumno", 
        domain=[('x_cod_alumno', '!=', False)]
    )

    def action_sync(self):
        # Configuración de URL (IP de Windows desde Docker)
        base_url = "http://192.168.1.140:8088/api"
        
        try:
            if self.sync_type == 'centro':
                res = requests.get(f"{base_url}/centros/principal", timeout=10)
                res.raise_for_status()
                self._sync_centros(res.json())
                
            if self.sync_type == 'docente':
                if not self.centro_id: raise UserError("Debe seleccionar un Centro.")
                res = requests.get(f"{base_url}/profesores/centro/{self.centro_id.x_cod_centro}", timeout=10)
                res.raise_for_status()
                self._sync_docentes(res.json())
                
            elif self.sync_type == 'alumno':
                if not self.centro_id: raise UserError("Debe seleccionar un Centro.")
                res = requests.get(f"{base_url}/alumnos/centro/{self.centro_id.x_cod_centro}", timeout=10)
                res.raise_for_status()
                self._sync_alumnos(res.json())

            elif self.sync_type == 'asistencia':
                if not self.alumno_id: raise UserError("Debe seleccionar un Alumno.")
                res = requests.get(f"{base_url}/asistencias/historial/{self.alumno_id.x_cod_alumno}", timeout=10)
                res.raise_for_status()
                self._sync_asistencias(res.json())

            elif self.sync_type == 'tarea':
                if not self.alumno_id: raise UserError("Debe seleccionar un Alumno.")
                res = requests.get(f"{base_url}/tareas/alumno/{self.alumno_id.x_cod_alumno}", timeout=10)
                res.raise_for_status()
                self._sync_tareas(res.json())

        except Exception as e:
            raise UserError(_("Error de conexión con la API Spring Boot: %s") % str(e))

        return {'type': 'ir.actions.client', 'tag': 'reload'}
    
    def _sync_centros(self, item):
        """ Lógica para importar/actualizar el Centro Principal """
        if not item:
            return

        vals = {
            'name': item.get('nombre'),
            'street': item.get('direccion'),
            'city': item.get('localidad'),
            'phone': item.get('telefono'),
            'email': item.get('correoInstitucional'),
            'x_cod_centro': item.get('codCentro'),
            'is_company': True,
        }

        # Buscamos si ya existe por el código único
        cod_centro = item.get('codCentro')
        existing = self.env['res.partner'].search([('x_cod_centro', '=', cod_centro)], limit=1)
        
        if existing:
            existing.write(vals)
        else:
            self.env['res.partner'].create(vals)

    def _sync_docentes(self, data):
        for item in data:
            vals = {
                'name': f"{item.get('nombre')} {item.get('apellidos')}",
                'email': item.get('email'),
                'function': item.get('rol'),
                'x_cod_docente': item.get('id'),
                'x_num_alumnos': item.get('numAlumnos'),
                'x_centro_id': self.centro_id.id,
                'is_company': False,
            }
            existing = self.env['res.partner'].search([('x_cod_docente', '=', item.get('id'))], limit=1)
            if existing: existing.write(vals)
            else: self.env['res.partner'].create(vals)

    def _sync_alumnos(self, data):
        for item in data:
            prof_data = item.get('profesor') or {}
            docente = self.env['res.partner'].search([('x_cod_docente', '=', prof_data.get('id'))], limit=1)
            vals = {
                'name': f"{item.get('nombre')} {item.get('apellidos')}",
                'email': item.get('email'),
                'x_cod_alumno': item.get('id'),
                'x_horas_acumuladas': item.get('horasTotales'),
                'x_centro_id': self.centro_id.id,
                'x_cod_docente_id': docente.id if docente else False,
                'is_company': False,
            }
            existing = self.env['res.partner'].search([('x_cod_alumno', '=', item.get('id'))], limit=1)
            if existing: existing.write(vals)
            else: self.env['res.partner'].create(vals)

    def _sync_asistencias(self, data):
        for item in data:
            def _to_float(t):
                if not t: return 0.0
                h, m, s = map(int, t.split(':'))
                return h + m/60.0
            
            vals = {
                'x_id_asistencia': item.get('idAsistencia'),
                'x_fecha': item.get('fecha'),
                'x_hora_entrada': _to_float(item.get('horaEntrada')),
                'x_hora_salida': _to_float(item.get('horaSalida')),
                'x_horas_diarias': item.get('horasDiarias'),
                'x_fk_alumno': self.alumno_id.id,
                'x_observaciones': item.get('observaciones'),
            }
            existing = self.env['asistencia.gestion_asistencia'].search([('x_id_asistencia', '=', item.get('idAsistencia'))], limit=1)
            if existing: existing.write(vals)
            else: self.env['asistencia.gestion_asistencia'].create(vals)

    def _sync_tareas(self, data):
        for item in data:
            vals = {
                'x_id_tarea': item.get('idTarea'),
                'x_titulo_tarea': item.get('titulo'),
                'x_descripcion_tarea': item.get('descripcion'),
                'x_fecha_asignacion': item.get('fechaAsignacion'),
                'x_fecha_limite': item.get('fechaLimite'),
                'x_estado_tarea': item.get('estado'),
                'x_horas_estimadas_ia': item.get('horasEstimadasIA'),
                'x_horas_reales': item.get('horasReales'),
                'x_alumno_id': self.alumno_id.id,
            }
            existing = self.env['tareas.alumno'].search([('x_id_tarea', '=', item.get('idTarea'))], limit=1)
            if existing: existing.write(vals)
            else: self.env['tareas.alumno'].create(vals)