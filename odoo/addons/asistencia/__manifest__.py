# -*- coding: utf-8 -*-
{
    'name': 'Gestión de Asistencias',
    'version': '1.0',
    'summary': 'Registro de asistencias de alumnos',
    'description': """
        Proyecto de Implantación de Odoo - ADAPTACIÓN RA4.
        Permite almacenar la información de asistencia de los alumnos,
        incluyendo fecha, hora de entrada y salida, horas diarias y observaciones.
        Se asocia cada registro a un alumno específico.
    """,
    'author': 'David Romero',
    'category': 'Custom',

    # Dependencias necesarias
    'depends': ['base', 'alumnos', 'centro_docente'],

    # Vistas (opcional, se descomenta cuando crees el archivo xml)
    'data': [
        'security/ir.model.access.csv',
        'views/asistencia_views.xml',
    ],

    'installable': True,
    'application': False,
    'license': 'LGPL-3',
}