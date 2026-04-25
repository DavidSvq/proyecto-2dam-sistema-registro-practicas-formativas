{
    'name': 'Gestión de Centros Docentes',
    'version': '1.0',
    'summary': 'Adaptación de contactos para la información de Centros Docentes',
    'description': """
        Proyecto de Implantación de Odoo - ADAPTACIÓN RA4.
        Permite almacenar información de centros educativos.
    """,
    'author': 'David Romero',
    'category': 'Custom',
    
    # Se adapta el módulo de Contactos (res.partner) 
    'depends': [
        'base',
        'contacts',
    ],
    
    # Adaptación de las vistas
    'data': [
        'views/res_partner_views.xml',
    ],
    
    'installable': True,
    'application': True,
    'license': 'LGPL-3',
}