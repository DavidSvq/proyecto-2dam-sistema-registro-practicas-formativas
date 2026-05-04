# 📂 Proyecto DAM - Repositorio Central

Bienvenido al repositorio central del proyecto. Este espacio gestiona la infraestructura de persistencia, la lógica de negocio y la documentación técnica del sistema de registros para prácticas formativas.

---

### 📝 Descripción del Proyecto

El **Sistema de Gestión de Prácticas DAM** es una plataforma diseñada para digitalizar y centralizar el seguimiento académico y administrativo de las **Formaciones en Centros de Trabajo (FCT)**. 

El sistema permite la interacción coordinada entre centros educativos, empresas colaboradoras y el alumnado, asegurando la trazabilidad de las horas de prácticas y las competencias adquiridas.

Basado en una arquitectura de microservicios, el núcleo del sistema gestiona la persistencia de datos y la lógica de negocio mediante una **API REST** robusta. 

Actualmente, el proyecto cubre el ciclo completo de gestión de entidades (**Centros, Empresas y Profesores**) y la operativa diaria de las prácticas (**Asistencias y Tareas**).

---

## 🗂️ Estructura del Proyecto

El repositorio se organiza en los siguientes módulos, reflejando el progreso actual de la implementación:

### 🗄️ 1. Infraestructura de Base de Datos (MySQL)
🟢 **Estado: Operativo**. La base de datos se levanta automáticamente como parte del entorno unificado mediante **Docker Compose**, incluyendo la configuración de **MySQL 8.0** y los scripts de inicialización.
👉 **[Documentación de Infraestructura](./docs/Backend/diagramas/entidad_relacion/)**

---

### ⚙️ 2. API Rest de Gestión (Backend)
🟢 **Estado: Operativo / En desarrollo**. Núcleo lógico del proyecto encargado de la persistencia y exposición de la API REST. Desarrollado con **Java 17** y **Spring Boot 3.5.11**.

* **Gestión Académica:** Control de centros, profesores y alumnos.
* **Gestión de FCT:** Administración de empresas colaboradoras y tutores de empresa.
* **Operativa:** Registro de asistencias y flujo de estados en tareas.

👉 **[Documentación de la API Rest](./backend/backend/README.md)**

---

### 📂 3. Documentación Técnica (Docs)

🟢 **Estado: Operativo**. Centraliza los artefactos de diseño, especificaciones del microservicio y manuales de uso. Todo el material detallado se encuentra disponible en la carpeta de documentos.

👉 **[Acceder a la carpeta de Documentación Técnica](./docs/Backend)**

#### **Diagramas de Diseño (UML & BD):**
* **Diagrama de Clases:** Estructura de entidades y relaciones del backend.
* **Modelo Entidad-Relación:** Diseño lógico de la persistencia en MySQL.
* **Diagrama de Secuencia:** Detalle del proceso lógico de **Asistencias**.
* **Diagrama de Estados:** Ciclo de vida y transiciones de la **Tarea**.

#### **Especificaciones y Guías (PDF):**
* **Documento de Requisitos e Ingeniería:** Compendio técnico que incluye Requisitos Funcionales (**RF**), Requisitos de Información (**RI**), Casos de Uso (**CU**), Historias de Usuario (**HU**) y **Matriz de Trazabilidad**.
* **Guía de Endpoints:** Manual detallado de la API REST con ejemplos de consulta, protocolos de respuesta y guía de pruebas.

#### **Documentación de Interfaz y UX (Frontend):**
* **Análisis y Diseño de Interfaz:** Documento detallado sobre la estructura de la aplicación, casos de uso por rol y diseño de componentes en React.
* **Flujos de Usuario:** Definición de la experiencia para Alumnos, Tutores de Empresa y Profesores.
* **Guía de Integración:** Detalles sobre el consumo de servicios, gestión de estados y validación de errores.

---

### 📱 4. Interfaz de Usuario (Frontend)
🟢 **Estado: Operativo**. Interfaz web modular diseñada para la gestión integral de las prácticas, permitiendo una experiencia personalizada según el rol del usuario (Alumno, Tutor o Profesor). Desarrollada con **React** y **Vite**.

* **Arquitectura Modular:** Organización por dominios para separar las vistas de Alumnos, Empresas y Gestión Docente.
* **Gestión de Roles:** Interfaz adaptativa que filtra funcionalidades y accesos según el perfil de usuario.
* **Consumo de API:** Integración centralizada con el microservicio backend para la gestión de tareas y asistencias.
* **Experiencia de Usuario (UX):** Sistema de navegación mediante rutas anidadas y componentes reutilizables para optimizar la fluidez.

👉 **[Documentación Detallada del Frontend](./frontend/README.md)**

---

### 💼 5. Sistema Externo ERP (Odoo)

🟢 **Estado: Operativo**. Integración con un sistema ERP externo basado en **Odoo**, diseñado como repositorio espejo para la explotación de datos del sistema principal.

* **Consumo de API:** Obtiene información directamente desde la API REST del backend.
* **Persistencia Propia:** Almacenamiento independiente en base de datos **PostgreSQL**.
* **Visualización y Reporting:** Generación de informes avanzados en formato PDF.
* **Sistema de Soporte:** No modifica ni envía datos al sistema principal, por lo que no actúa como fuente de verdad.

👉 **[Documentación de Integración Odoo](/odoo/README.md)**

---

### 🤖 6. Microservicio de Predicción (FastAPI)

🟢 **Estado: Operativo**. Servicio independiente basado en **FastAPI** encargado de estimar la duración de las tareas mediante modelos predictivos.

* **Integración con Backend:** Invocado automáticamente durante la creación de tareas.
* **Procesamiento de Datos:** Recibe información contextual de la tarea para su análisis.
* **Estimación de Duración:** Devuelve una predicción de horas estimadas.
* **Sin Persistencia:** No almacena datos, funcionando como servicio de cálculo en tiempo real.

👉 **[Documentación del Microservicio](./ML/README.md)**

---

### 🚀 7. Procedimiento de Despliegue con Docker Compose

🟢 **Estado: Operativo**. Proceso estandarizado para la puesta en marcha de todo el ecosistema de microservicios mediante contenedores.

#### **Requisitos Previos:**
Para garantizar una ejecución exitosa del sistema, es necesario cumplir las siguientes condiciones:

* **Estado de Docker:** El motor de Docker (**Docker Desktop** en Windows/Mac o daemon en Linux) debe estar instalado y en ejecución.
* **Disponibilidad de Puertos:** El sistema anfitrión debe tener libres los siguientes puertos:
  * **5173** → Frontend (React / Vite)
  * **8088** → Backend (Spring Boot)
  * **3308** → Base de Datos MySQL
  * **8000** → Microservicio FastAPI
  * **8069** → Odoo
  * **5432** → PostgreSQL (Odoo)

---

#### **Pasos de Despliegue:**

1. **Descarga del Proyecto:**  
   Clonar el repositorio oficial o descargar el código fuente:  
   `git clone https://github.com/tu-usuario/tu-repositorio.git`

2. **Localización del Orquestador:**  
   Acceder desde terminal al directorio raíz del proyecto, donde se encuentra el archivo  
   `docker-compose.yml`

3. **Levantamiento de Servicios:**  
   Ejecutar el siguiente comando para construir y arrancar todos los servicios:  
   `docker-compose up --build`

   Este proceso automatiza:
   * Descarga de imágenes oficiales  
   * Compilación del backend (Java / Spring Boot)  
   * Construcción del frontend (React)  
   * Creación de la red virtual **red-global-dam**

---

#### **Acceso al Sistema:**

Una vez finalizado el proceso, todos los contenedores estarán en estado operativo, permitiendo el acceso a los distintos servicios a través de sus respectivos puertos en el entorno local.

---

#### **Notas Adicionales:**

* Para la carga y gestión de los módulos de **Odoo**, consultar la documentación específica disponible en el README dentro de la carpeta correspondiente.

👉 **[Documentación carga modulos Odoo](/odoo/README.md)**