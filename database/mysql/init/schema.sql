-- 1. Entidad Centro Docente (Con todos los campos de RI)
CREATE TABLE IF NOT EXISTS centros (
    codigo_centro VARCHAR(20) PRIMARY KEY,
    nombre_oficial VARCHAR(150) NOT NULL,
    direccion VARCHAR(255),
    localidad VARCHAR(100),
    telefono VARCHAR(20),
    correo_institucional VARCHAR(100) UNIQUE
);

-- 2. Entidad Empresa (CIF como PK validada por Odoo)
CREATE TABLE IF NOT EXISTS empresas (
    cif VARCHAR(15) PRIMARY KEY,
    razon_social VARCHAR(150) NOT NULL,
    direccion VARCHAR(255),
    localidad VARCHAR(100),
    telefono_contacto VARCHAR(20),
    email_contacto VARCHAR(100),
    persona_contacto VARCHAR(100)
);

-- 3. Entidad Personal Docente
CREATE TABLE IF NOT EXISTS personal_docente (
    codigo_docente VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL DEFAULT '1234',
    rol VARCHAR(50) NOT NULL,
    num_alumnos INT DEFAULT 0,
    fk_centro VARCHAR(20),
    FOREIGN KEY (fk_centro) REFERENCES centros(codigo_centro)
);

-- 4. Entidad Personal de Empresa (Tutor)
CREATE TABLE IF NOT EXISTS tutores_empresa (
    codigo_tutor VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL DEFAULT '1234',
    rol VARCHAR(50) NOT NULL,
    num_alumnos INT DEFAULT 0,
    fk_empresa VARCHAR(15),
    FOREIGN KEY (fk_empresa) REFERENCES empresas(cif)
);

-- 5. Entidad Alumno
CREATE TABLE IF NOT EXISTS alumnos (
    id_codigo_alumno VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL DEFAULT '1234',
    rol VARCHAR(50) NOT NULL,
    horas_totales INT DEFAULT 0,
    fk_centro VARCHAR(20),
    fk_empresa VARCHAR(15),
    fk_profesor VARCHAR(20), -- FK ahora es VARCHAR
    fk_tutor VARCHAR(20),    -- FK ahora es VARCHAR
    FOREIGN KEY (fk_centro) REFERENCES centros(codigo_centro),
    FOREIGN KEY (fk_empresa) REFERENCES empresas(cif),
    FOREIGN KEY (fk_profesor) REFERENCES personal_docente(codigo_docente),
    FOREIGN KEY (fk_tutor) REFERENCES tutores_empresa(codigo_tutor)
);

-- 6. Entidad Asistencia (Fichaje diario del alumno)
CREATE TABLE IF NOT EXISTS asistencias (
    id_asistencia BIGINT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    hora_entrada TIME NOT NULL,
    hora_salida TIME,
    horas_diarias DOUBLE DEFAULT 0.0,
    fk_alumno VARCHAR(20) NOT NULL,
    observaciones TEXT,
    CONSTRAINT fk_asistencia_alumno 
        FOREIGN KEY (fk_alumno) 
        REFERENCES alumnos(id_codigo_alumno) 
        ON DELETE CASCADE
);

-- 7. Entidad Tarea (Tareas asignadas y realizadas por el alumno)
CREATE TABLE IF NOT EXISTS tareas (
    id_tarea BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    fecha_asignacion DATE NOT NULL,
    fecha_limite DATE,
    
    -- ESTADOS: 'ASIGNADA', 'REASIGNADA', 'CANCELADA', 'POSTPUESTA', 'COMPLETADA' (por Alumno), 'VALIDADA' (por Profesor-Tutor)
    estado VARCHAR(20) DEFAULT 'ASIGNADA', 
    
    -- Machine Learning (Regresión)
    horas_estimadas_ia DECIMAL(5,2), 
    horas_reales DECIMAL(5,2) DEFAULT 0.0,

    -- RELACIONES (FKs)
    fk_tutor_empresa VARCHAR(20) NOT NULL, -- EL QUE CREA Y ASIGNA
    fk_alumno VARCHAR(20) NOT NULL,        -- EL QUE REALIZA Y MARCA COMO COMPLETADA
    fk_profesor_tutor VARCHAR(20),         -- EL QUE REVISA Y VALIDA FINALMENTE

    CONSTRAINT fk_tarea_tutor_empresa FOREIGN KEY (fk_tutor_empresa) 
        REFERENCES tutores_empresa(codigo_tutor),
    CONSTRAINT fk_tarea_alumno FOREIGN KEY (fk_alumno) 
        REFERENCES alumnos(id_codigo_alumno),
    CONSTRAINT fk_tarea_prof_tutor FOREIGN KEY (fk_profesor_tutor) 
        REFERENCES personal_docente(codigo_docente)
) ENGINE=InnoDB;


-- --- DATOS DE PRUEBA (2 por tabla) ---

-- 1. Centro
INSERT INTO centros (codigo_centro, nombre_oficial, direccion, localidad, telefono, correo_institucional) VALUES 
('CEN01', 'IES Innovación Sevilla', 'Avenida de la Paz 50', 'Sevilla', '954123456', 'secretaria@iessevilla.es');

-- 2. Empresas
INSERT INTO empresas (cif, razon_social, direccion, localidad, email_contacto) VALUES 
('CIF001', 'Tech Solutions S.L.', 'Parque Tecnológico 1', 'Madrid', 'rrhh@tech.com'),
('CIF002', 'Sistemas Avanzados SA', 'Calle Mayor 5', 'Madrid', 'info@sistemas.es'),
('CIF003', 'Andalucía Software', 'Isla de la Cartuja', 'Sevilla', 'jobs@andsoft.es'),
('CIF004', 'Cloud Services', 'Calle Nube 9', 'Sevilla', 'admin@cloud.es'),
('CIF005', 'Data Mining Corp', 'Polígono Industrial 4', 'Madrid', 'data@corp.com'),
('CIF006', 'Odoo Partners', 'Avenida Principal 10', 'Sevilla', 'contacto@odoo.es');

-- 3. Personal docente unificado a CEN01, con rol y password
INSERT INTO personal_docente (codigo_docente, nombre, apellidos, email, password, rol, fk_centro) VALUES 
('DOC001', 'Juan', 'El Gestor', 'juan.gestor@iesmadrid.es', '1234', 'PROFESOR_GESTOR', 'CEN01'),
('DOC002', 'Ana', 'García', 'ana.tutor@iesmadrid.es', '1234', 'PROFESOR_TUTOR', 'CEN01'),
('DOC003', 'Luis', 'Pérez', 'luis.tutor@iesmadrid.es', '1234', 'PROFESOR_TUTOR', 'CEN01'),
('DOC004', 'Marta', 'López', 'marta.tutor@iesmadrid.es', '1234', 'PROFESOR_TUTOR', 'CEN01'),
('DOC005', 'Pedro', 'Ramírez', 'pedro.tutor@iesmadrid.es', '1234', 'PROFESOR_TUTOR', 'CEN01'),
('DOC006', 'Sofía', 'Castro', 'sofia.tutor@iesmadrid.es', '1234', 'PROFESOR_TUTOR', 'CEN01'),
('DOC007', 'Raúl', 'Sanz', 'raul.tutor@iesmadrid.es', '1234', 'PROFESOR_TUTOR', 'CEN01'),
('DOC008', 'Elena', 'Blanco', 'elena.tutor@iesmadrid.es', '1234', 'PROFESOR_TUTOR', 'CEN01');

-- 4. Tutores de Empresa (TUT001 a TUT006) con rol y password
INSERT INTO tutores_empresa (codigo_tutor, nombre, apellidos, email, password, rol, fk_empresa) VALUES 
('TUT001', 'Carlos', 'Empresa1', 'carlos@tech.com', '1234', 'TUTOR_EMPRESA', 'CIF001'),
('TUT002', 'Beatriz', 'Empresa2', 'bea@sistemas.es', '1234', 'TUTOR_EMPRESA', 'CIF002'),
('TUT003', 'Sergio', 'Empresa3', 'sergio@andsoft.es', '1234', 'TUTOR_EMPRESA', 'CIF003'),
('TUT004', 'Laura', 'Empresa4', 'laura@cloud.es', '1234', 'TUTOR_EMPRESA', 'CIF004'),
('TUT005', 'Pablo', 'Empresa5', 'pablo@corp.com', '1234', 'TUTOR_EMPRESA', 'CIF005'),
('TUT006', 'Irene', 'Empresa6', 'irene@odoo.es', '1234', 'TUTOR_EMPRESA', 'CIF006');


-- 5. Alumnos todos en CEN01, con rol y password
INSERT INTO alumnos (id_codigo_alumno, nombre, apellidos, email, password, rol, fk_centro, fk_empresa, fk_profesor, fk_tutor) VALUES 
('ALU01', 'Alumno', 'Uno', 'alu01@gmail.com', '1234', 'ALUMNO', 'CEN01', 'CIF001', 'DOC002', 'TUT001'),
('ALU02', 'Alumno', 'Dos', 'alu02@gmail.com', '1234', 'ALUMNO', 'CEN01', 'CIF001', 'DOC002', 'TUT001'),
('ALU03', 'Alumno', 'Tres', 'alu03@gmail.com', '1234', 'ALUMNO', 'CEN01', 'CIF002', 'DOC002', 'TUT002'),
('ALU04', 'Alumno', 'Cuatro', 'alu04@gmail.com', '1234', 'ALUMNO', 'CEN01', 'CIF002', 'DOC003', 'TUT002'),
('ALU05', 'Alumno', 'Cinco', 'alu05@gmail.com', '1234', 'ALUMNO', 'CEN01', 'CIF005', 'DOC003', 'TUT005'),
('ALU06', 'Alumno', 'Seis', 'alu06@gmail.com', '1234', 'ALUMNO', 'CEN01', 'CIF005', 'DOC004', 'TUT005'),
('ALU07', 'Alumno', 'Siete', 'alu07@gmail.com', '1234', 'ALUMNO', 'CEN01', 'CIF001', 'DOC004', 'TUT001'),
('ALU08', 'Alumno', 'Ocho', 'alu08@gmail.com', '1234', 'ALUMNO', 'CEN01', 'CIF002', 'DOC002', 'TUT002'),
('ALU09', 'Alumno', 'Nueve', 'alu09@gmail.com', '1234', 'ALUMNO', 'CEN01', 'CIF005', 'DOC003', 'TUT005'),
('ALU10', 'Alumno', 'Diez', 'alu10@gmail.com', '1234', 'ALUMNO', 'CEN01', 'CIF001', 'DOC004', 'TUT001'),
('ALU11', 'Alumno', 'Once', 'alu11@gmail.com', '1234', 'ALUMNO', 'CEN01', 'CIF003', 'DOC005', 'TUT003'),
('ALU12', 'Alumno', 'Doce', 'alu12@gmail.com', '1234', 'ALUMNO', 'CEN01', 'CIF003', 'DOC005', 'TUT003'),
('ALU13', 'Alumno', 'Trece', 'alu13@gmail.com', '1234', 'ALUMNO', 'CEN01', 'CIF004', 'DOC006', 'TUT004'),
('ALU14', 'Alumno', 'Catorce', 'alu14@gmail.com', '1234', 'ALUMNO', 'CEN01', 'CIF004', 'DOC006', 'TUT004'),
('ALU15', 'Alumno', 'Quince', 'alu15@gmail.com', '1234', 'ALUMNO', 'CEN01', 'CIF006', 'DOC007', 'TUT006'),
('ALU16', 'Alumno', 'Dieciséis', 'alu16@gmail.com', '1234', 'ALUMNO', 'CEN01', 'CIF006', 'DOC007', 'TUT006'),
('ALU17', 'Alumno', 'Diecisiete', 'alu17@gmail.com', '1234', 'ALUMNO', 'CEN01', 'CIF003', 'DOC008', 'TUT003'),
('ALU18', 'Alumno', 'Dieciocho', 'alu18@gmail.com', '1234', 'ALUMNO', 'CEN01', 'CIF004', 'DOC008', 'TUT004'),
('ALU19', 'Alumno', 'Diecinueve', 'alu19@gmail.com', '1234', 'ALUMNO', 'CEN01', 'CIF006', 'DOC005', 'TUT006'),
('ALU20', 'Alumno', 'Veinte', 'alu20@gmail.com', '1234', 'ALUMNO', 'CEN01', 'CIF003', 'DOC006', 'TUT003');

-- 6. Datos de Prueba para Asistencias (4 registros para 6 alumnos distintos)
-- Los IDs son autoincrementales, por lo que no los incluyo en el INSERT.

INSERT INTO asistencias (fecha, hora_entrada, hora_salida, horas_diarias, fk_alumno, observaciones) VALUES 
-- Alumno 01 (CEN01 - CIF001)
('2026-03-16', '08:00:00', '14:00:00', 6.0, 'ALU01', 'Configuración de entorno Docker y primera toma de contacto.'),
('2026-03-17', '08:00:00', '15:00:00', 7.0, 'ALU01', 'Reunión con el tutor de empresa y revisión de requisitos.'),
('2026-03-18', '08:15:00', '14:15:00', 6.0, 'ALU01', 'Maquetación básica del Front-end en Angular.'),
('2026-03-19', '09:00:00', '14:00:00', 5.0, 'ALU01', 'Corrección de errores en los estilos CSS.'),

-- Alumno 03 (CEN01 - CIF002)
('2026-03-16', '09:00:00', '14:00:00', 5.0, 'ALU03', 'Lectura de la documentación de la API interna.'),
('2026-03-17', '09:00:00', '14:00:00', 5.0, 'ALU03', 'Pruebas de endpoints con Postman.'),
('2026-03-18', '08:30:00', '14:30:00', 6.0, 'ALU03', 'Implementación de validaciones en el controlador.'),
('2026-03-19', '09:00:00', '15:30:00', 6.5, 'ALU03', 'Documentación técnica de los nuevos servicios.'),

-- Alumno 05 (CEN01 - CIF005)
('2026-03-16', '08:00:00', '13:00:00', 5.0, 'ALU05', 'Análisis de la base de datos MySQL existente.'),
('2026-03-17', '08:00:00', '14:00:00', 6.0, 'ALU05', 'Optimización de consultas SQL lentas.'),
('2026-03-18', '08:00:00', '14:00:00', 6.0, 'ALU05', 'Creación de scripts de migración de datos.'),
('2026-03-19', '08:00:00', '14:00:00', 6.0, 'ALU05', 'Pruebas de carga en el servidor de desarrollo.'),

-- Alumno 11 (CEN02 - CIF003)
('2026-03-16', '07:30:00', '13:30:00', 6.0, 'ALU11', 'Instalación de dependencias de Maven y configuración inicial.'),
('2026-03-17', '07:30:00', '14:00:00', 6.5, 'ALU11', 'Desarrollo de las clases Entity y Repository.'),
('2026-03-18', '07:30:00', '14:30:00', 7.0, 'ALU11', 'Implementación de la lógica de negocio en el Service.'),
('2026-03-19', '07:30:00', '13:30:00', 6.0, 'ALU11', 'Refactorización de código y limpieza de logs.'),

-- Alumno 13 (CEN02 - CIF004)
('2026-03-16', '10:00:00', '16:00:00', 6.0, 'ALU13', 'Investigación sobre despliegue en la nube.'),
('2026-03-17', '10:00:00', '15:00:00', 5.0, 'ALU13', 'Configuración de buckets en AWS para archivos.'),
('2026-03-18', '10:00:00', '16:00:00', 6.0, 'ALU13', 'Pruebas de subida y bajada de archivos desde la app.'),
('2026-03-19', '10:00:00', '16:00:00', 6.0, 'ALU13', 'Ajustes de permisos y seguridad en los servicios.'),

-- Alumno 15 (CEN02 - CIF006)
('2026-03-16', '08:30:00', '14:30:00', 6.0, 'ALU15', 'Personalización de módulos en Odoo.'),
('2026-03-17', '08:30:00', '14:30:00', 6.0, 'ALU15', 'Creación de campos personalizados para el cliente.'),
('2026-03-18', '08:30:00', '14:30:00', 6.0, 'ALU15', 'Mantenimiento preventivo del servidor local.'),
('2026-03-19', '08:30:00', '15:30:00', 7.0, 'ALU15', 'Backup de bases de datos y limpieza de temporales.');

-- Esto "sincroniza" los contadores de los alumnos con los INSERT manuales
UPDATE alumnos a 
SET a.horas_totales = (
    SELECT IFNULL(SUM(h.horas_diarias), 0) 
    FROM asistencias h 
    WHERE h.fk_alumno = a.id_codigo_alumno
);

-- Insertamos 4 tareas por cada alumno con asistencia registrada
INSERT INTO tareas 
(titulo, descripcion, fecha_asignacion, fecha_limite, estado, horas_estimadas_ia, horas_reales, fk_tutor_empresa, fk_alumno, fk_profesor_tutor) 
VALUES 

-- Tareas para ALU01 (Asignadas por TUT001, Supervisadas por DOC002)
('Configurar Docker', 'Levantar contenedores para MySQL y Spring Boot', '2026-03-16', '2026-03-17', 'VALIDADA', 4.0, 4.0, 'TUT001', 'ALU01', 'DOC002'),
('Revisión Requisitos', 'Analizar el documento de arquitectura con el equipo', '2026-03-17', '2026-03-17', 'VALIDADA', 2.5, 3.0, 'TUT001', 'ALU01', 'DOC002'),
('Maquetación Angular', 'Crear componentes base de navegación', '2026-03-18', '2026-03-20', 'COMPLETADA', 6.0, 6.0, 'TUT001', 'ALU01', 'DOC002'),
('Corrección CSS', 'Ajustar responsive design en pantallas móviles', '2026-03-19', '2026-03-21', 'ASIGNADA', 3.5, 0.0, 'TUT001', 'ALU01', 'DOC002'),

-- Tareas para ALU03 (Asignadas por TUT002, Supervisadas por DOC002)
('Documentación API', 'Leer y documentar los endpoints de auth', '2026-03-16', '2026-03-16', 'VALIDADA', 5.0, 5.0, 'TUT002', 'ALU03', 'DOC002'),
('Testing Postman', 'Crear colecciones de pruebas para el módulo ventas', '2026-03-17', '2026-03-17', 'VALIDADA', 4.0, 5.0, 'TUT002', 'ALU03', 'DOC002'),
('Validaciones Controller', 'Añadir anotaciones @Valid en DTOs', '2026-03-18', '2026-03-19', 'COMPLETADA', 6.0, 6.0, 'TUT002', 'ALU03', 'DOC002'),
('Servicios Técnicos', 'Implementar lógica de negocio en ServiceImpl', '2026-03-19', '2026-03-22', 'ASIGNADA', 8.0, 0.0, 'TUT002', 'ALU03', 'DOC002'),

-- Tareas para ALU05 (Asignadas por TUT005, Supervisadas por DOC003)
('Análisis MySQL', 'Diagrama E-R de la base de datos de producción', '2026-03-16', '2026-03-16', 'VALIDADA', 4.0, 5.0, 'TUT005', 'ALU05', 'DOC003'),
('Optimización SQL', 'Crear índices en tablas de logs', '2026-03-17', '2026-03-17', 'VALIDADA', 3.0, 6.0, 'TUT005', 'ALU05', 'DOC003'),
('Script Migración', 'Exportación de datos a formato JSON', '2026-03-18', '2026-03-19', 'COMPLETADA', 7.5, 6.0, 'TUT005', 'ALU05', 'DOC003'),
('Pruebas Carga', 'Uso de JMeter para estresar el login', '2026-03-19', '2026-03-23', 'ASIGNADA', 5.0, 0.0, 'TUT005', 'ALU05', 'DOC003'),

-- Tareas para ALU11 (Asignadas por TUT003, Supervisadas por DOC005)
('Maven Config', 'Gestión de dependencias y perfiles pom.xml', '2026-03-16', '2026-03-16', 'VALIDADA', 2.0, 6.0, 'TUT003', 'ALU11', 'DOC005'),
('Entidades JPA', 'Mapeo de la tabla productos y categorías', '2026-03-17', '2026-03-17', 'VALIDADA', 6.0, 6.5, 'TUT003', 'ALU11', 'DOC005'),
('Business Logic', 'Cálculo de impuestos en el carrito de compra', '2026-03-18', '2026-03-19', 'COMPLETADA', 8.0, 7.0, 'TUT003', 'ALU11', 'DOC005'),
('Refactorización', 'Limpieza de código y aplicación de SonarQube', '2026-03-19', '2026-03-20', 'ASIGNADA', 4.0, 0.0, 'TUT003', 'ALU11', 'DOC005'),

-- Tareas para ALU13 (Asignadas por TUT004, Supervisadas por DOC006)
('Research Cloud', 'Comparativa entre AWS y Azure para el proyecto', '2026-03-16', '2026-03-16', 'VALIDADA', 6.0, 6.0, 'TUT004', 'ALU13', 'DOC006'),
('AWS S3 Config', 'Configurar buckets de almacenamiento', '2026-03-17', '2026-03-17', 'VALIDADA', 4.0, 5.0, 'TUT004', 'ALU13', 'DOC006'),
('Upload Service', 'Subida de imágenes desde el frontend', '2026-03-18', '2026-03-19', 'COMPLETADA', 6.0, 6.0, 'TUT004', 'ALU13', 'DOC006'),
('IAM Security', 'Roles y permisos de usuarios en el bucket', '2026-03-19', '2026-03-22', 'ASIGNADA', 4.5, 0.0, 'TUT004', 'ALU13', 'DOC006'),

-- Tareas para ALU15 (Asignadas por TUT006, Supervisadas por DOC007)
('Odoo Modding', 'Instalación de módulos de inventario', '2026-03-16', '2026-03-16', 'VALIDADA', 5.0, 6.0, 'TUT006', 'ALU15', 'DOC007'),
('Custom Fields', 'Añadir campos de fecha en vistas XML', '2026-03-17', '2026-03-17', 'VALIDADA', 3.0, 6.0, 'TUT006', 'ALU15', 'DOC007'),
('Server Maintenance', 'Actualización de parches en servidor Ubuntu', '2026-03-18', '2026-03-19', 'COMPLETADA', 4.0, 6.0, 'TUT006', 'ALU15', 'DOC007'),
('Backup DB', 'Automatización de copias de seguridad con cron', '2026-03-19', '2026-03-20', 'ASIGNADA', 2.0, 0.0, 'TUT006', 'ALU15', 'DOC007');