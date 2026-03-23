# ⚙️ Microservicio de Gestión de Formación Dual

## 1. Visión General
El presente microservicio constituye el **núcleo operativo** para la gestión de alumnos en prácticas de Formación Profesional Dual. Su propósito fundamental es centralizar la comunicación y el seguimiento entre tres actores críticos del ecosistema educativo:

* **Centro Docente:** Supervisión académica y validación de competencias.
* **Empresa Colaboradora:** Asignación de tareas técnicas y tutorización profesional.
* **Alumno:** Registro de actividad y desarrollo de aprendizaje práctico.

El sistema garantiza la **trazabilidad total** de las asistencias y el progreso de las tareas asignadas, proporcionando una fuente única de verdad para la evaluación del periodo de prácticas.

---

## 2. Arquitectura Técnica y Entidades

Desarrollado bajo el ecosistema de **Spring Boot**, el sistema implementa una arquitectura de persistencia robusta basada en una **jerarquía de herencia** desde una clase base `Usuario`. Las entidades clave gestionadas se dividen en tres áreas operativas:

### 🏛️ Gestión Institucional
Actúan como los nodos organizativos principales del sistema:
* **Centros Docentes:** Entidades educativas que coordinan la formación.
* **Empresas:** Organizaciones colaboradoras donde se realizan las prácticas.

### 👤 Roles de Usuario
Especializaciones de la entidad base que definen los permisos y acciones:
* **Personal Docente:** Incluye perfiles de **Gestores** (administración del centro) y **Tutores** (seguimiento académico).
* **Tutores de Empresa:** Profesionales responsables de la mentoría en el puesto de trabajo.
* **Alumnos:** Usuarios en formación y principales ejecutores de la actividad diaria.

### ⚙️ Operativa Diaria
Entidades que capturan el flujo de trabajo real:
* **Asistencias:** Registro de fichajes con cálculo automatizado de jornada laboral.
* **Tareas:** Unidades de trabajo con estados de flujo (`ASIGNADA`, `EN PROGRESO`, `REASIGNADA`, `COMPLETADA`,`REVISADA`) para el seguimiento de competencias.

---

## 3. Funcionalidades Destacadas

* **Cálculo de Horas Automatizado:** Al registrar una salida (`Asistencia`), el sistema calcula la diferencia de tiempo y actualiza mediante `@Transactional` el contador de `horas_totales` en la ficha del `Alumno`.
* **Gestión de Tareas con Estimación:** La entidad `Tarea` incluye el campo `horas_estimadas_ia` para almacenar predicciones de tiempo.

---

## 4. Flujo de Control y Validación

El ciclo de vida de las tareas está restringido por una lógica de estados que asegura la revisión docente:

1.  **ASIGNADA:** Estado inicial tras la creación por el Tutor de Empresa.
2.  **EN PROGRESO / REASIGNADA:** Gestión de la actividad por parte del Alumno.
3.  **COMPLETADA:** El Alumno cierra la tarea aportando las `horas_reales` (Validación en `TareaService`).
4.  **REVISADA / CANCELADA:** Estados finales de control por parte del Profesor o Tutor.

> **Nota:** Los diagramas detallados de estos flujos se encuentran en la carpeta `/docs/backend/diagramas`.

---

## 5. Diseño de Base de Datos y Escalabilidad

El esquema de persistencia se ha diseñado siguiendo estándares de normalización para asegurar la integridad de los datos:

* **Tipado de Claves:** Uso de `BIGINT` para identificadores de gran volumen (Asistencias, Tareas) y `VARCHAR(20)` para códigos de entidad (`cif`, `codCentro`), optimizando la indexación.
* **Integridad Referencial:** Relaciones mapeadas mediante claves ajenas que garantizan la consistencia entre los registros de alumnos, empresas y sus actividades.
* **Rendimiento:** Estructura preparada para el crecimiento del histórico de asistencias y tareas sin degradación en las consultas de reporte.

---

### 📂 Documentación Adicional

Para una consulta detallada sobre la lógica interna, consulta los recursos en la carpeta `/docs/backend`:
* **Diagramas:** Entidad-Relación, Clases y Estados (`/diagramas`).
* **API:** Contratos de entrada/salida y códigos de respuesta (`/endpoints`).

---

# 🚀 Backend - Guía de Desarrollo y Uso

Este módulo contiene la **API REST** desarrollada con **Java 17** y **Spring Boot 3.5.11**. Sigue estos pasos para levantar el entorno desde cero en local.

---

## 🛠️ Stack Tecnológico

El microservicio ha sido construido utilizando las siguientes tecnologías y librerías:

* **Core:** [Java 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) con [Spring Boot 3.5.11](https://spring.io/projects/spring-boot).
* **Persistencia:** [Spring Data JPA](https://spring.io/projects/spring-data-jpa) (Hibernate como motor ORM).
* **Base de Datos:** [MySQL 8.0](https://www.mysql.com/) para el almacenamiento relacional.
* **Infraestructura:** [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/) para el despliegue automatizado y la orquestación del contenedor de la base de datos.
* **Productividad:** [Lombok](https://projectlombok.org/) para la reducción de código *boilerplate* (Generación automática de Getters, Setters y Constructores).
* **Validación:** [Spring Boot Starter Validation](https://docs.spring.io/spring-boot/docs/current/reference/html/io.html#io.validation) para asegurar la integridad de los datos en DTOs y Entidades.

---

## 📋 Requisitos Previos

***Java 17** (o superior) instalado y configurado en el PATH.
***Maven 3.8** instalado localmente para la gestión de dependencias y compilación.
***Docker Desktop** activo para la gestión de contenedores de la base de datos.
***Git** instalado para el control de versiones.
***IDE Recomendado**: Se recomienda el uso de **IntelliJ IDEA** (entorno utilizado para el desarrollo), aunque es compatible con otros IDEs como VS Code o Eclipse con los plugins adecuados.

---

## 🛠️ Paso 1: Levantar la Infraestructura

Antes de arrancar la aplicación, necesitamos que la base de datos esté lista. Desde la raíz del proyecto:

1.  Navega a la carpeta de infraestructura:
    ```bash
    cd infra
    ```
2.  Levanta el contenedor de MySQL:
    ```bash
    docker-compose up -d
    ```

> **Nota:** Esto ejecutará automáticamente el script `database/mysql/init/schema.sql` y creará la BD `dam_project_db`.

---

## 🏗️ Paso 2: Arrancar el Backend (Maven Local)

Una vez que la infraestructura está activa, abre una terminal nueva:

1.  Entra en el directorio del backend:
    ```bash
    cd backend/backend
    ```
2.  Compila y arranca la aplicación usando tu instalación local de Maven:
    ```bash
    mvn spring-boot:run
    ```

> **Nota:** En caso de **no utilizar un IDE** (ejecutando directamente desde la terminal del sistema), asegúrate de tener configuradas las variables de entorno `JAVA_HOME` (apuntando a Java 17) y `M2_HOME` para que el comando `mvn` sea reconocido globalmente.

---

## 🔌 Endpoints de la API (GET)

Puedes verificar los datos cargados mediante el `schema.sql` accediendo a las siguientes URLs:

| Entidad | URL de Consulta |
| :--- | :--- |
| **Centros** | `http://localhost:8088/api/centros/CEN02` |
| **Empresas** | `http://localhost:8088/api/empresas/CIF001` |
| **Profesores** | `http://localhost:8088/api/profesores/centro/CEN01` |
| **Tutores Empresa** | `http://localhost:8088/api/tutores-empresa/empresa/CIF001` |
| **Alumnos** | `http://localhost:8088/api/alumnos/ALU01` |
| **Asistencias** | `http://localhost:8088/api/asistencias/historial/ALU01` |
| **Tareas** | `http://localhost:8088/api/tareas/alumno/ALU01` |

Para visualizar más información de todos los endpoins acudir a la carpeta `/docs/backend/endpoints`

---

## 🧪 Prueba de Persistencia (POST)

Para verificar que la escritura en la base de datos funciona correctamente, realiza una petición **POST** a `http://localhost:8088/api/empresas` con el siguiente cuerpo JSON:

    {
    "cif": "B11223344",
    "razonSocial": "Nueva Empresa de Prueba",
    "localidad": "Sevilla",
    "emailContacto": "test@empresa.com"
    }

---

## 🔍 Comprobar resultado 

Una vez realizado el envío, puedes verificar que la empresa se ha guardado correctamente listando de nuevo todas las entidades:

> **Nota importante:** Para realizar la petición **POST** se debe utilizar **Postman** (o cualquier cliente equivalente como Insomnia o Thunder Client). No es posible realizar esta acción directamente desde la barra de direcciones del navegador.

👉 [Ver listado actualizado de empresas](http://localhost:8088/api/empresas)

## 🔐 Credenciales de Conexión (DBeaver / MySQL Workbench)

Si deseas conectarte directamente a la base de datos desde un cliente externo:

* **Host:** `localhost`
* **Puerto:** `3308`
* **Base de Datos:** `dam_project_db`
* **Usuario:** `dam_user`
* **Contraseña:** `dam_password`

---

## 📢 NOTA FINAL: ESTE PROYECTO SE ENCUENTRA ACTUALMENTE EN PLENO DESARROLLO, POR LO QUE EL CÓDIGO Y LA DOCUMENTACIÓN IRÁN SUFRIENDO MODIFICACIONES PERIÓDICAS.

---

⬅️ [Volver al Repositorio Principal](../../README.md)