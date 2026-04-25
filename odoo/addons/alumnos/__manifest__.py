{
    'name': 'Gestión de Alumnos',
    'version': '1.0',
    'summary': 'Adaptación de contactos para la información de Alumnos',
    'description': """
        Proyecto de Implantación de Odoo - ADAPTACIÓN RA4.
        Permite almacenar información de los alumnos,
        asociándolos a un Centro Docente y a un Profesor.
    """,
    'author': 'David Romero',
    'category': 'Custom',

    # Dependencias necesarias
    'depends': [
        'centro_docente',
        'personal_docente',
    ],

    # Vistas
    'data': [
        'views/res_partner_views.xml',
    ],

    'installable': True,
    'application': False,
    'license': 'LGPL-3',
}