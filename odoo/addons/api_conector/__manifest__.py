{
    'name': 'API Connector',
    'version': '1.0',
    'category': 'Tools',
    'summary': 'Conector centralizado para Spring Boot API',
    'depends': [
        'base', 
        'contacts',
        'centro_docente', 
        'personal_docente', 
        'alumnos',
        'asistencia',
        'tareas'
    ],
    'data': [
        'security/ir.model.access.csv',
        'wizard/api_sync_wizard_views.xml',
        'views/api_menu_actions.xml',
    ],
    'installable': True,
    'application': False,
}