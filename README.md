# 📂 Proyecto DAM - Repositorio Central

Bienvenido al repositorio central del proyecto. Este espacio gestiona la infraestructura de persistencia, la lógica de negocio y la documentación técnica del sistema de registros para prácticas formativas.

---

### 📝 Descripción del Proyecto

El **Sistema de Gestión de Prácticas DAM** es una plataforma diseñada para digitalizar y centralizar el seguimiento académico y administrativo de las **Formaciones en Centros de Trabajo (FCT)**. 

El sistema permite la interacción coordinada entre centros educativos, empresas colaboradoras y el alumnado, asegurando la trazabilidad de las horas de prácticas y las competencias adquiridas.

Basado en una arquitectura de microservicios, el núcleo del sistema gestiona la persistencia de datos y la lógica de negocio mediante una **API REST** robusta. 

Actualmente, el proyecto cubre el ciclo completo de gestión de entidades (**Centros, Empresas y Profesores**) y la operativa diaria de las prácticas (**Asistencias y Tareas**).

---

### ⏳ Próximas Implementaciones (Roadmap)

El proyecto se encuentra en fase de expansión técnica, con las siguientes integraciones previstas:

* **Módulo de Inteligencia Artificial:** Conexión con una **API de Python** especializada en modelos de **regresión**, orientada a la optimización y predicción del cálculo de horas.
* **Integración con ERP (Odoo):** Desarrollo de módulos personalizados en **Odoo** para actuar como repositorio central de datos. Esta integración incluirá la adaptación de vistas e informes avanzados para la explotación de la información almacenada.

---

## 🗂️ Estructura del Proyecto (Estado de Desarrollo)

El repositorio se organiza en los siguientes módulos, reflejando el progreso actual de la implementación:

### 🗄️ 1. Infraestructura de Base de Datos (MySQL)
🟢 **Estado: Operativo**. Configuración de Docker para MySQL 8.0 y scripts de inicialización automatizada.
👉 **[Documentación de Infraestructura](./infra/README.md)**

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

### 💼 5. Módulo en Odoo (ERP)
⚪ **Estado: Próximamente**. Integración prevista para actuar como repositorio central de datos y generación de informes avanzados. Se desarrollará un módulo personalizado para sincronizar la operativa de las prácticas con la gestión administrativa del centro.

👉 **[Documentación de Integración Odoo (Pendiente)]()**

---

## 🚀 Instrucciones de Inicio Rápido

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/DavidSvq/proyecto-dam-sistemas-registros-practicas-formativas

## 📢 NOTA FINAL: ESTE PROYECTO SE ENCUENTRA ACTUALMENTE EN PLENO DESARROLLO, POR LO QUE EL CÓDIGO Y LA DOCUMENTACIÓN IRÁN SUFRIENDO MODIFICACIONES PERIÓDICAS.