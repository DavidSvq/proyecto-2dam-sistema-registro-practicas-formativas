{
    'name': 'Gestión de Personal Docente',
    'version': '1.0',
    'summary': 'Adaptación de contactos para la información del Personal Docente',
    'description': """
        Proyecto de Implantación de Odoo - ADAPTACIÓN RA4.
        Permite almacenar información del personal docente
        y asociarlo a un Centro Docente.
    """,
    'author': 'David Romero',
    'category': 'Custom',

    # Dependencias necesarias
    'depends': [
        'centro_docente',
    ],

    # Vistas
    'data': [
        'views/res_partner_views.xml',
    ],

    'installable': True,
    'application': False,
    'license': 'LGPL-3',
}