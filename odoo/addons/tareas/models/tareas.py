# -*- coding: utf-8 -*-
from odoo import models, fields

class TareasAlumno(models.Model):
    _name = 'tareas.alumno'
    _description = 'Registro de Tareas de Alumnos FCT'

    x_id_tarea = fields.Integer(
        string="ID Tarea",
        required=True,
        readonly=False
    )

    x_titulo_tarea = fields.Char(
        string='Título de la Tarea', 
        required=True
    )
    
    x_descripcion_tarea = fields.Text(
        string='Descripción Detallada'
    )
    
    x_fecha_asignacion = fields.Date(
        string='Fecha de Asignación', 
        default=fields.Date.context_today
    )
    
    x_fecha_limite = fields.Date(
        string='Fecha Límite'
    )
    
    x_estado_tarea = fields.Char(
        string='Estado', 
        default='Asignada'
    )
    
    x_horas_estimadas_ia = fields.Float(
        string='Horas Estimadas (IA)'
    )
    
    x_horas_reales = fields.Float(
        string='Horas Reales'
    )

    # Relación obligatoria con Alumno (res.partner)
    x_alumno_id = fields.Many2one(
        'res.partner', 
        string='Alumno', 
        required=True, 
        ondelete='cascade',
        domain=[('x_cod_alumno', '!=', False)]
    )