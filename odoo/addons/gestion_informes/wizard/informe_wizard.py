from odoo import models, fields, api
from odoo.exceptions import UserError

class InformeGestionWizard(models.TransientModel):
    _name = 'informe.gestion.wizard'
    _description = 'Asistente para la Generación de Informes'

    # 1. Selección del tipo de informe
    x_tipo_informe = fields.Selection([
        ('alumno', 'Informe de Alumno'),
        ('centro', 'Informe de Centro Docente')
    ], string='Tipo de Informe', required=True, default='alumno')

    # 2. Campos para el Informe de Alumno
    x_alumno_id = fields.Many2one(
        'res.partner', 
        string='Alumno',
        domain=[('x_cod_alumno', '!=', False)]
    )

    # 3. Campo para el Informe de Centro
    x_centro_id = fields.Many2one(
        'res.partner', 
        string='Centro Docente',
        domain=[('x_cod_centro', '!=', False)]
    )

    def action_generar_pdf(self):
        """
        Esta función se ejecuta al pulsar el botón del Wizard.
        Busca el registro procesado en la Vista SQL y lo envía al reporte.
        """
        self.ensure_one()
        
        if self.x_tipo_informe == 'alumno':
            if not self.x_alumno_id:
                raise UserError("Para el informe de alumno debe seleccionar el alumno.")
            
            # Buscamos el registro ya calculado en nuestra Vista SQL
            report_obj = self.env['report.modelo.sql.alumno'].search([('id', '=', self.x_alumno_id.id)], limit=1)
            
            if not report_obj:
                raise UserError("No hay datos consolidados para este alumno en el sistema.")
            
            # Enviamos el objeto de la vista SQL directamente al reporte
            return self.env.ref('gestion_informes.action_report_alumno_sql').report_action(report_obj)

        elif self.x_tipo_informe == 'centro':
            if not self.x_centro_id:
                raise UserError("Debe seleccionar un Centro Docente.")
            
            # Buscamos el registro ya calculado en nuestra Vista SQL de Centros
            report_obj = self.env['report.modelo.sql.centro'].search([('id', '=', self.x_centro_id.id)], limit=1)
            
            if not report_obj:
                raise UserError("No hay datos consolidados para este centro en el sistema.")
                
            return self.env.ref('gestion_informes.action_report_centro_sql').report_action(report_obj)