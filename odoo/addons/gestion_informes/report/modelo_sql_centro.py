from odoo import models, fields, tools

class ReportModeloSqlCentro(models.Model):
    _name = 'report.modelo.sql.centro'
    _auto = False
    _description = 'Modelo SQL para Informe de Centros'

    # Campos de cabecera (exactos según tu lista)
    x_cod_centro = fields.Char('Código Centro', readonly=True)
    name = fields.Char('Nombre Centro', readonly=True)
    street = fields.Char('Dirección', readonly=True)
    city = fields.Char('Ciudad', readonly=True)
    phone = fields.Char('Teléfono', readonly=True)
    email = fields.Char('Email', readonly=True)
    
    # Métricas de conteo (para el resumen de la cabecera)
    total_alumnos = fields.Integer('Total Alumnos', readonly=True)
    total_docentes = fields.Integer('Total Docentes', readonly=True)

    def init(self):
        tools.drop_view_if_exists(self.env.cr, self._table)
        self.env.cr.execute("""
            CREATE OR REPLACE VIEW %s AS (
                SELECT 
                    CEN.id AS id,
                    CEN.x_cod_centro AS x_cod_centro,
                    CEN.name AS name,
                    CEN.street AS street,
                    CEN.city AS city,
                    CEN.phone AS phone,
                    CEN.email AS email,
                    /* Conteo de Alumnos vinculados */
                    CAST(COUNT(DISTINCT ALU.id) AS INTEGER) AS total_alumnos,
                    /* Conteo de Docentes vinculados */
                    CAST(COUNT(DISTINCT DOC.id) AS INTEGER) AS total_docentes
                FROM 
                    res_partner CEN
                LEFT JOIN 
                    res_partner ALU ON ALU.x_centro_id = CEN.id AND ALU.x_cod_alumno IS NOT NULL
                LEFT JOIN 
                    res_partner DOC ON DOC.x_centro_id = CEN.id AND DOC.x_cod_docente IS NOT NULL
                WHERE 
                    CEN.x_cod_centro IS NOT NULL
                GROUP BY 
                    CEN.id, CEN.x_cod_centro, CEN.name, CEN.street, CEN.city, CEN.phone, CEN.email
            )
        """ % self._table)