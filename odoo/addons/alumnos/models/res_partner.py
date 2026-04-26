# -*- coding: utf-8 -*-
from odoo import models, fields, api
from odoo.exceptions import ValidationError

class ResPartnerAlumno(models.Model):
    _inherit = 'res.partner'

    # Campos específicos para alumnos
    x_cod_alumno = fields.Char(string='Código Alumno', copy=False)
    x_horas_acumuladas = fields.Integer(string='Horas Acumuladas', default=0)
    
    # Relaciones
    x_centro_id = fields.Many2one('res.partner', string='Centro Docente',
                                  domain=[('x_cod_centro','!=',False)])
    x_cod_docente_id = fields.Many2one('res.partner', string='Personal Docente',
                                       domain=[('x_cod_docente','!=',False)])
    
    @api.constrains('x_cod_alumno')
    def _check_cod_alumno(self):
        for record in self:
            if record.x_cod_alumno:
                existing = self.search([('x_cod_alumno','=',record.x_cod_alumno),('id','!=',record.id)])
                if existing:
                    raise ValidationError('El código de alumno debe ser único.')

    # -----------------------------
    # ONCHANGE: filtrar docentes según centro
    # -----------------------------
    @api.onchange('x_centro_id')
    def _onchange_centro_id(self):
        if self.x_centro_id:
            return {
                'domain': {
                    'x_cod_docente_id': [('x_centro_id', '=', self.x_centro_id.id)]
                }
            }
        else:
            # Si no hay centro, no mostrar ningún docente
            return {
                'domain': {
                    'x_cod_docente_id': [('id', '=', False)]
                }
            }