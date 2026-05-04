# 📱 Interfaz de Usuario (Frontend) - Gestión de Formación Dual

## 1. Visión General
Este módulo constituye la **capa de presentación** del sistema de gestión de prácticas DAM. Su propósito es ofrecer una experiencia de usuario intuitiva y eficiente, permitiendo que cada actor interactúe con el núcleo del sistema según sus necesidades específicas:

* **Alumnos:** Registro de actividad diaria, gestión de tareas y control de asistencias.
* **Tutores de Empresa:** Creación y seguimiento técnico de las tareas asignadas.
* **Profesores (Gestores/Tutores):** Administración de entidades y validación académica del progreso.

La aplicación está diseñada bajo un enfoque **SPA (Single Page Application)**, garantizando una navegación fluida y una carga de datos optimizada mediante el consumo de la API REST del backend.

---

## 2. Arquitectura del Frontend

La aplicación sigue una **Arquitectura Modular por Dominios**, lo que facilita el mantenimiento y la escalabilidad del proyecto:

### 🧩 Componentización y Diseño
* **Componentes Reutilizables:** Uso de elementos comunes (Layouts, Navbars, Sidebars y Tablas) compartidos entre los diferentes roles.
* **Rutas Anidadas (Nested Routes):** Implementación de una estructura de navegación jerárquica que mantiene el contexto visual mientras cambia el contenido central.
* **Vistas por Rol:** Interfaces diferenciadas mediante lógica de renderizado condicional para Alumno, Tutor y Profesor.

### 🔄 Gestión de Datos y Flujo
* **Servicios Centralizados:** Capa dedicada para las peticiones HTTP, centralizando la URL base de la API y el manejo de errores.
* **Estado Local:** Uso de Hooks de React para la gestión del ciclo de vida de los datos y la interacción del usuario en tiempo real.

---

## 3. Estructura del Proyecto

Basado en una organización modular para separar responsabilidades:

* **`src/api/`**: Contiene la configuración base de la API y la instancia cliente (Axios) para la comunicación con el servidor.
* **`src/components/`**: Componentes visuales reutilizables (Botones, Formularios, Layouts).
* **`src/modules/`**: Contenedores principales de las vistas, divididos por actor:
    * **`auth/`**: Módulo crítico para la gestión de acceso, persistencia de sesión y seguridad de rutas.
    * **`Alumno/`**: Vistas de historial, tareas y perfil del estudiante.
    * **`Tutor Empresa/`**: Panel del tutor de empresa y gestión de tareas.
    * **`Profesor Gestor/`**: Vistas administrativas para el resto de entidades.
    * **`Profesor Tutor/`**: Interfaz para el seguimiento académico y validación de las FCT.
* **`src/services/`**: Capa de comunicación con el backend utilizando **Axios**, donde se centralizan las peticiones a la API.

---

## 🛠️ Stack Tecnológico

* **Core:** [React 19](https://react.dev/) (Última versión estable).
* **Tooling:** [Vite 8](https://vitejs.dev/) (Entorno de desarrollo rápido).
* **Estilos:** [Bootstrap 5.3](https://getbootstrap.com/) y [React-Bootstrap](https://react-bootstrap.github.io/) para componentes UI.
* **Iconografía:** [Bootstrap Icons](https://icons.getbootstrap.com/).
* **Cliente HTTP:** [Axios](https://axios-http.com/) para el consumo de la API REST.
* **Enrutado:** [React Router 7](https://reactrouter.com/).

---

# 🚀 Frontend - Guía de Desarrollo y Uso

Este módulo ha sido desarrollado utilizando **React** y **Vite**. Sigue estos pasos para levantar el entorno de desarrollo local.

---

## 🛠️ Stack Tecnológico

* **Core:** [React](https://react.dev/) (Biblioteca para interfaces de usuario).
* **Herramienta de Construcción:** [Vite](https://vitejs.dev/) (Frontend Tooling ultra rápido).
* **Estilos:** [Bootstrap 5](https://getbootstrap.com/) (Framework CSS para diseño responsive).
* **Enrutado:** [React Router](https://reactrouter.com/) (Gestión de navegación SPA).
* **Iconografía:** [React Icons](https://react-icons.github.io/react-icons/) (Conjunto de iconos vectoriales).

---

## 📋 Requisitos Previos

* **Node.js** (Versión 18 o superior recomendada).
* **npm** (Gestor de paquetes, incluido con Node.js).
* **Backend Activo:** Para que la interfaz muestre datos, el microservicio de Spring Boot debe estar corriendo en `http://localhost:8088`.

---

## 🌐 Conexión con el Backend

Nota de Integración: El sistema cuenta con soporte nativo para el intercambio de recursos entre orígenes (CORS), ya configurado en el backend mediante @CrossOrigin, garantizando la comunicación inmediata con el entorno de desarrollo.

* **Base URL API:** `http://localhost:8088/api`

---

## 🔑 Acceso al Sistema (Entorno de Desarrollo)

Actualmente, el sistema utiliza las siguientes credenciales preconfiguradas para pruebas en local. **La contraseña es `1234` para todos los perfiles.**

| Rol | Email de acceso |
| :--- | :--- |
| **Alumno** | `alu01@gmail.com` |
| **Profesor Gestor** | `juan.gestor@iesmadrid.es` |
| **Profesor Tutor** | `ana.tutor@iesmadrid.es` |
| **Tutor Empresa** | `carlos@tech.com` |

---

⬅️ [Volver al Repositorio Principal](../README.md)
