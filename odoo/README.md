# 💼 Ecosistema de Gestión Académica - Odoo ERP

## 1. Visión General
Este entorno está integrado en el proyecto por **requerimiento académico**, actuando como un sistema secundario para la simulación de gestión administrativa. Su función se limita a la recepción y almacenamiento de los datos generados por la aplicación principal (Backend Java), actuando como un repositorio espejo que descarga la información de las prácticas para representar cómo una entidad externa gestionaría dicha documentación en un entorno ERP real.

---

## 2. Arquitectura de Módulos Personalizados
El sistema se organiza en una suite de módulos interconectados. Técnicamente, todos los módulos heredan del modelo **base** de Odoo para su representación en vistas y persistencia, dividiéndose según su especialización:

### 🧩 Extensiones de Contactos (Herencia `res.partner`)
Estos módulos extienden la entidad base de contactos de Odoo para integrar los campos específicos requeridos por la aplicación:

* **Centro Docente:** Extensión para gestionar códigos de centro (`x_cod_centro`) y datos institucionales.
* **Personal Docente:** Adaptación para perfiles de tutores y gestores, incluyendo la vinculación técnica a los centros.
* **Alumnos:** Ficha extendida para el seguimiento del estudiante, que incluye contadores de horas y relación con su tutor docente.

### 🏗️ Modelos de Nueva Creación
Estructuras diseñadas desde cero (heredando de `base`) para capturar la operativa descargada desde la API:

* **Gestión de Asistencias:** Modelo específico para el registro de fichajes, horas diarias calculadas y observaciones.
* **Tareas FCT:** Sistema de seguimiento de tareas que refleja los estados, descripciones y tiempos de ejecución procesados en la App principal.

### ⚙️ Módulos de Servicio y Utilidad
* **API Connector:** Motor lógico que gestiona la comunicación REST con el Backend Java y los Wizards de sincronización.
* **Gestión de Informes:** Módulo independiente que centraliza la generación de documentos PDF, permitiendo la salida documental de los datos de Alumnos y Centros.

---

## 3. Flujo de Sincronización Jerárquica
Para mantener la integridad referencial y asegurar que las claves ajenas (*foreign keys*) se vinculen correctamente, la primera carga de datos (cuando el sistema está vacío) debe realizarse siguiendo este orden estrictamente jerárquico:

1.  🏛️ **Centros:** Creación de la entidad raíz indispensable para el resto de relaciones.
2.  👨‍🏫 **Personal Docente:** Registros vinculados obligatoriamente al centro creado previamente.
3.  🎓 **Alumnos:** Estudiantes vinculados tanto al docente como al centro.
4.  🕒 **Asistencias:** Registros de jornada vinculados de forma unívoca a un alumno.
5.  📋 **Tareas:** Unidades de trabajo asociadas al historial del alumno.

> **Nota sobre el funcionamiento dinámico:** Aunque el orden lógico desde cero es el indicado, el **Wizard de Sincronización** está diseñado para ser funcional una vez que existen datos en la BBDD. En sincronizaciones posteriores, el asistente ofrece selectores dinámicos que permiten elegir entre los registros existentes (por ejemplo, seleccionar un centro específico para traer a sus profesores, o un alumno concreto para descargar sus tareas), facilitando la actualización selectiva de la información.

---

## 4. Gestión de Informes (Reporting)
Ubicado en el menú superior bajo la denominación **"Gestión de Informes"**, este módulo permite la explotación documental de los datos almacenados mediante asistentes (*wizards*) de selección. Su objetivo es transformar la información técnica descargada en documentos PDF profesionales.

### 📄 Informe de Alumno
Genera un expediente de seguimiento académico consolidado. Incluye:
* **Datos Identificativos:** Nombre, email y código único del alumno.
* **Control de Horas:** Desglose comparativo entre horas previstas y horas reales de ejecución.
* **Resumen Operativo:** Cuantificación total de asistencias registradas y tareas completadas.
* **Validación:** Espacios reservados para la firma del alumno y el sello del centro o tutor.

### 🏫 Informe de Centro
Proporciona un resumen administrativo de la estructura organizativa y los recursos del centro docente. Incluye:
* **Información Institucional:** Nombre del centro, dirección, contacto y código de centro único.
* **Indicadores de Gestión:** Volumen total de alumnos matriculados y personal docente activo en la plataforma.
* **Relaciones Detalladas:** Listado nominal completo y correos electrónicos tanto del personal docente como del alumnado vinculado.

>**Nota técnica:** Estos informes se generan como un consolidado de estado actual basado exclusivamente en los datos existentes en el repositorio de Odoo en el momento de la emisión.

---

## 5. Estructura de Navegación (UI)
La interfaz de Odoo se ha organizado para reflejar fielmente la estructura de datos de la aplicación principal, facilitando la verificación visual de la información descargada:

| Menú | Tipo de Módulo | Función en el Guardado Espejo |
| :--- | :--- | :--- |
| **Centros Docentes** | Herencia `res.partner` | Persistencia de los datos institucionales del centro de origen. |
| **Personal Docente** | Herencia `res.partner` | Registro espejo de los tutores y gestores de la App. |
| **Alumnos** | Herencia `res.partner` | Almacenamiento de perfiles de estudiantes y sus contadores de horas. |
| **Asistencias** | Modelo Propio (`base`) | Repositorio de los registros de jornada y fichajes sincronizados. |
| **Tareas FCT** | Modelo Propio (`base`) | Histórico de actividades, estados y descripciones de las tareas. |
| **Gestión de Informes**| Módulo de Servicio | Motor de salida para generar los PDF basados en los datos espejados. |

---

# 🚀 Guía de Instalación y Configuración

## 📋 Requisitos Previos
* **Docker Desktop:** Entorno necesario para la orquestación de contenedores.
* **Librería Python `requests`:** Indispensable para que el motor del **API Connector** pueda realizar las peticiones HTTP al Backend Java.
* **Conexión de Red:** Asegurar que el contenedor de Odoo tiene permisos para acceder al puerto `8088` del Host.

---

## 🏗️ Configuración Inicial e Instalación de Módulos

Para que el sistema funcione correctamente como espejo, siga este procedimiento detallado. Es un proceso **cíclico**: debe repetir los pasos de activación y búsqueda para cada módulo.

### 1. Configuración de la Base de Datos (Primer acceso)
Al acceder por primera vez a `http://localhost:8069`, visualizará el asistente de creación de base de datos.
* **Master Password:** Odoo generará una por defecto. **Es fundamental anotarla** o cambiarla por una conocida (ej: `admin`), ya que será necesaria para gestionar la BBDD en el futuro.
* **Database Name:** Nombre para el repositorio (ej: `odoo_practicas`).
* **Credenciales:** Email y contraseña para el acceso administrativo.
* **Language / Country:** Español / España.
* **Demo Data:** **No marcar**. Queremos el repositorio vacío para una sincronización limpia.

### 2. El Ciclo de Instalación (Repetir para cada módulo)
Debido al comportamiento de Odoo, tras instalar cada módulo deberá repetir estos pasos para asegurar que el siguiente sea visible y configurable:

1.  **Activar Modo Desarrollador:** Vaya a **Ajustes** > Final de página > **"Activar modo desarrollador"**. (Odoo suele desactivar la sesión técnica tras una instalación).
2.  **Actualizar Inventario:** Diríjase al menú **Aplicaciones** y pulse en **"Actualizar lista de aplicaciones"**.
3.  **Limpiar Filtros:** En la barra de búsqueda, haga clic en la **"x"** del filtro `Aplicaciones`. Si no lo borra, sus módulos personalizados no aparecerán.
4.  **Buscar e Instalar:** Escriba el nombre técnico y pulse **"Instalar"**.

### 3. Orden Estricto de Instalación Manual
Siga este orden para respetar las dependencias del sistema:

* **1º** `centro_docente`
* **2º** `personal_docente`
* **3º Búsqueda por "Alumno":** Al buscar este término (y limpiar el filtro), instale uno a uno:
    * `alumno`
    * `asistencia`
    * `tareas`
    * `gestion_informes`
* **4º** `api_connector` (Instalar al final para habilitar la sincronización con Spring Boot).

> **Aviso:** Si tras instalar un módulo no encuentra el siguiente en la lista, asegúrese de haber pulsado "Actualizar lista de aplicaciones" y de haber borrado el filtro por defecto de la búsqueda.

--- 

⬅️ [Volver al Repositorio Principal](../README.md)
