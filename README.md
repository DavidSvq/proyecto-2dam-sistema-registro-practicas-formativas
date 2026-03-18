# 📂 Proyecto DAM - Repositorio Central

Bienvenido al repositorio central del proyecto. Aquí se gestionan la infraestructura de MySQL, los módulos de Odoo y el futuro Backend.

## 🗂️ Estructura del Proyecto

---

### 🗄️ 1. Infraestructura de Base de Datos (MySQL)
Configuración de Docker para MySQL 8.0 y scripts de inicialización.

👉 **[Guia para levantar primero la bbdd del microservicio](./infra/README.md)**

---

### ⚙️ Microservicio de Gestión (Backend)

Este microservicio constituye el núcleo lógico del proyecto, encargado de la persistencia de datos y la exposición de una API REST para la gestión de entidades educativas y empresariales.

Está desarrollado con **Java 17** y **Spring Boot**, utilizando una base de datos **MySQL** para el almacenamiento. Su función principal es centralizar la información de:

* **Gestión Académica:** Control de centros, profesores y alumnos.
* **Gestión de FCT:** Administración de empresas colaboradoras y tutores de empresa.
* **Capa de Persistencia:** Implementación de validaciones y relaciones entre entidades para asegurar la integridad de los datos.

👉 **[Guia para probar el microservicio en local](./backend/backend/README.md)**

---

## 🚀 Instrucciones de Inicio Rápido

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/DavidSvq/proyecto-dam-sistemas-registros-practicas-formativas

## 📢 NOTA FINAL: ESTE PROYECTO SE ENCUENTRA ACTUALMENTE EN PLENO DESARROLLO, POR LO QUE EL CÓDIGO Y LA DOCUMENTACIÓN IRÁN SUFRIENDO MODIFICACIONES PERIÓDICAS.