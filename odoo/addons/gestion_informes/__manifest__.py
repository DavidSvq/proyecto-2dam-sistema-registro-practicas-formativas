{
    'name': 'Gestión de Informes Académicos',
    'version': '1.0',
    'summary': 'Generación de informes PDF para Alumnos y Centros Docentes',
    'description': """
        Proyecto de Implantación de Odoo - ADAPTACIÓN RA4.
        Módulo centralizado para la extracción de datos mediante SQL
        y generación de informes mensuales de seguimiento.
    """,
    'author': 'David Romero',
    'category': 'Custom',

    # Dependencias necesarias (Punto 1 corregido: Incluye personal_docente)
    'depends': [
        'base',
        'alumnos',
        'asistencia',
        'centro_docente',
        'personal_docente',
        'tareas',
    ],

    # Archivos de datos (Punto 2 corregido: Rutas exactas)
    'data': [
        'security/ir.model.access.csv',
        'wizard/informe_wizard_view.xml',
        'report/report_actions.xml',
        'report/plantilla_pdf.xml',
    ],

    'installable': True,
    'application': False,
    'license': 'LGPL-3',
}