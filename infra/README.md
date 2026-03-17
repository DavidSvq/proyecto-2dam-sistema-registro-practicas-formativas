# 🚀 Infraestructura del Proyecto DAM - Módulo Base de Datos

Este repositorio contiene la configuración de infraestructura necesaria para el desarrollo del proyecto. Actualmente, la documentación cubre la fase de **Persistencia de Datos**.

## 🛠️ Configuración de la Base de Datos (BBDD)

Se utiliza **Docker** para garantizar un entorno de base de datos idéntico para todos los desarrolladores, evitando conflictos con instalaciones locales de MySQL.

### 📋 Requisitos Previos
* **Docker** instalado y en ejecución.
* **Puerto 3308** disponible en la máquina host.

---

### 🐳 Docker Compose: Servicio `db`

El archivo `docker-compose.yml` despliega un contenedor de **MySQL 8.0** con las siguientes especificaciones:

| Atributo | Valor |
| :--- | :--- |
| **Imagen** | `mysql:8.0` |
| **Nombre Contenedor** | `mysql_dam_project` |
| **Puerto Externo (Host)** | `3308` |
| **Puerto Interno (Docker)** | `3306` |
| **Base de Datos** | `dam_project_db` |
| **Usuario** | `dam_user` |
| **Password** | `dam_password` |

---

### 🚀 Instrucciones de Despliegue

1. **Situarse en el directorio de infraestructura:**

   ```Bash
   cd docker

2. **Levantar el contenedor:**

    ```Bash
    docker-compose up -d

3. **Verificar que el servicio está activo:**

    ```Bash
    docker ps

### 💾 Inicialización y Persistencia

    Scripts Iniciales: Al levantar el contenedor por primera vez, se ejecutan automáticamente los scripts ubicados en ./mysql/init/schema.sql. Este archivo contiene la estructura de tablas (Alumnos, Centros, Empresas, Docentes, Tutores) y datos de prueba.

    Volúmenes: Se utiliza el volumen mysql-data para asegurar que los registros no se borren al detener o reiniciar los contenedores.

### 🔧 Comandos de Mantenimiento

    Entrar a la consola de MySQL:

        docker exec -it mysql_dam_project mysql -u dam_user -pdam_password dam_project_db

    Resetear base de datos (Borrar todo y volver a crear):
    ⚠️ Atención: Esto eliminará todos los datos guardados que no estén en el script schema.sql.
        1º
        docker-compose down -v

        2º
        docker-compose up -d
> [!NOTE]
Estado Provisional: Esta documentación se actualizará a medida que se integren los microservicios de Backend (Spring Boot).