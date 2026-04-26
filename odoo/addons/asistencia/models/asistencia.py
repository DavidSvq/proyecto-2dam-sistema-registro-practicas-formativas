# -*- coding: utf-8 -*-
from odoo import models, fields


class GestionAsistencia(models.Model):
    _name = 'asistencia.gestion_asistencia'
    _description = 'Registro de Asistencias de Alumnos'

    # ID que viene de la API / BBDD externa
    x_id_asistencia = fields.Integer(
        string='ID Asistencia',
        required=True,
        readonly=False
    )

    x_fecha = fields.Date(
        string='Fecha',
        required=True
    )

    x_hora_entrada = fields.Float(
        string='Hora de Entrada',
        required=True
    )

    x_hora_salida = fields.Float(
        string='Hora de Salida'
    )

    x_horas_diarias = fields.Float(
        string='Horas Diarias',
        default=0.0
    )

    # Relación con Alumno (res.partner) filtrando solo registros que tengan código de alumno
    x_fk_alumno = fields.Many2one(
        'res.partner',
        string='Alumno',
        domain=[('x_cod_alumno', '!=', False)],
        required=True,
        ondelete='cascade'
    )

    x_observaciones = fields.Text(
        string='Observaciones'
    )