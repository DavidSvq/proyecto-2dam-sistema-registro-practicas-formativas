# -*- coding: utf-8 -*-
from odoo import models, fields, api
from odoo.exceptions import ValidationError


class ResPartner(models.Model):
    _inherit = 'res.partner'

    x_cod_docente = fields.Char(string='Código de Docente')
    x_num_alumnos = fields.Integer(string='Número de Alumnos', default=0)

    x_centro_id = fields.Many2one(
        'res.partner',
        string='Centro Docente',
        domain=[('x_cod_centro', '!=', False)]
    )

    _sql_constraints = [
        ('unique_cod_docente',
         'unique(x_cod_docente)',
         'El código de docente debe ser único.')
    ]

    @api.constrains('x_cod_docente', 'x_centro_id')
    def _check_docente_centro(self):
        for record in self:
            if record.x_cod_docente and not record.x_centro_id:
                raise ValidationError(
                    "Un docente debe tener asignado un Centro Docente."
                )