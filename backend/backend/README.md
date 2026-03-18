# 🚀 Backend - Guía de Desarrollo y Uso

Este módulo contiene la **API REST** desarrollada con **Java 17** y **Spring Boot 3.5.11**. Sigue estos pasos para levantar el entorno desde cero en local.

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
| **Centros** | `http://localhost:8088/api/centros/CEN01` |
| **Empresas** | `http://localhost:8088/api/empresas` |
| **Profesores** | `http://localhost:8088/api/profesores` |
| **Tutores Empresa** | `http://localhost:8088/api/tutores-empresa` |
| **Alumnos** | `http://localhost:8088/api/alumnos` |

---

## 🧪 Prueba de Persistencia (POST)

Para verificar que la escritura en la base de datos funciona correctamente, realiza una petición **POST** a `http://localhost:8088/api/empresas` con el siguiente cuerpo JSON:

    ```json
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