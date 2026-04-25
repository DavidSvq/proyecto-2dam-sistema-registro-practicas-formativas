# -*- coding: utf-8 -*-
from odoo import models, fields, api
from odoo.exceptions import ValidationError


class ResPartner(models.Model):
    _inherit = 'res.partner'

    x_cod_centro = fields.Char(string='Código de Centro')

    _sql_constraints = [
        ('unique_cod_centro',
         'unique(x_cod_centro)',
         'El código de centro debe ser único.')
    ]

    @api.constrains('x_cod_centro', 'is_company')
    def _check_centro_empresa(self):
        for record in self:
            if record.x_cod_centro and not record.is_company:
                raise ValidationError(
                    "Un Centro Docente debe ser una empresa."
                )