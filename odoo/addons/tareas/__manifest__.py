# -*- coding: utf-8 -*-
{
    'name': 'Gestión de Tareas',
    'version': '1.0',
    'summary': 'Registro de tareas de alumnos',
    'description': """
        Proyecto de Implantación de Odoo - ADAPTACIÓN RA4.
        Permite almacenar la información de tareas de los alumnos,
        incluyendo título, descripción, fechas, horas y estado.
        Se asocia cada registro a un alumno específico.
    """,
    'author': 'David Romero',
    'category': 'Custom',

    # Dependencias necesarias
    'depends': ['base', 'alumnos', 'centro_docente'],

    # Vistas (opcional, se descomenta cuando crees el archivo xml)
    'data': [
        'security/ir.model.access.csv',
        'views/tareas_views.xml',
    ],

    'installable': True,
    'application': False,
    'license': 'LGPL-3',
}