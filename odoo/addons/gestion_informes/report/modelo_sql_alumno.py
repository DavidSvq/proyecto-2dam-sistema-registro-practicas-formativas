from odoo import models, fields, api, tools

class ReportModeloSqlAlumno(models.Model):
    _name = 'report.modelo.sql.alumno'
    _description = 'Modelo SQL para Informe de Alumnos'
    _auto = False  # No crea tabla física

    # --- Datos del Alumno ---
    id = fields.Integer('ID', readonly=True)
    x_cod_alumno = fields.Char('Código Alumno', readonly=True)
    name = fields.Char('Nombre Alumno', readonly=True)
    email = fields.Char('Email Alumno', readonly=True)
    x_horas_acumuladas = fields.Float('Horas Acumuladas', readonly=True)

    # --- Datos del Centro Relacionado ---
    centro_name = fields.Char('Centro Educativo', readonly=True)
    centro_email = fields.Char('Email Centro', readonly=True)

    # --- Datos del Docente Relacionado ---
    docente_name = fields.Char('Tutor/Docente', readonly=True)

    # --- Resúmenes (Agregados) ---
    total_asistencias = fields.Integer('Total Días Asistencia', readonly=True)
    total_horas_reales = fields.Float('Suma Horas Reales', readonly=True)
    total_tareas = fields.Integer('Tareas Asignadas', readonly=True)

    def init(self):
        # Elimina la vista si ya existe para evitar conflictos al actualizar el módulo
        tools.drop_view_if_exists(self.env.cr, self._table)
        
        # Consulta SQL real
        self.env.cr.execute("""
            CREATE OR REPLACE VIEW %s AS (
                SELECT 
                    ALU.id AS id,
                    ALU.x_cod_alumno AS x_cod_alumno,
                    ALU.name AS name,
                    ALU.email AS email,
                    ALU.x_horas_acumuladas AS x_horas_acumuladas,
                    CEN.name AS centro_name,
                    CEN.email AS centro_email,
                    DOC.name AS docente_name,
                    
                    /* Cálculos agregados con COALESCE para evitar nulos */
                    CAST(COUNT(DISTINCT ASI.id) AS INTEGER) AS total_asistencias,
                    COALESCE(SUM(TAR.x_horas_reales), 0.0) AS total_horas_reales,
                    CAST(COUNT(DISTINCT TAR.id) AS INTEGER) AS total_tareas
                FROM 
                    res_partner ALU
                LEFT JOIN 
                    res_partner CEN ON ALU.x_centro_id = CEN.id
                LEFT JOIN 
                    res_partner DOC ON ALU.x_cod_docente_id = DOC.id
                LEFT JOIN 
                    asistencia_gestion_asistencia ASI ON ASI.x_fk_alumno = ALU.id
                LEFT JOIN 
                    tareas_alumno TAR ON TAR.x_alumno_id = ALU.id
                WHERE 
                    ALU.x_cod_alumno IS NOT NULL
                GROUP BY 
                    ALU.id, 
                    ALU.x_cod_alumno, 
                    ALU.name, 
                    ALU.email, 
                    ALU.x_horas_acumuladas,
                    CEN.name, 
                    CEN.email, 
                    DOC.name
            )
        """ % self._table)