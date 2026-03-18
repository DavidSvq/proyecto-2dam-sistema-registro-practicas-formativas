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
    rol ENUM('GESTOR', 'TUTOR') NOT NULL,
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

-- --- DATOS DE PRUEBA (2 por tabla) ---

-- 1. Centros
INSERT INTO centros (codigo_centro, nombre_oficial, direccion, localidad, telefono, correo_institucional) VALUES 
('CEN01', 'IES Tecnológico Madrid', 'Calle Falsa 123', 'Madrid', '912345678', 'info@iesmadrid.es'),
('CEN02', 'IES Innovación Sevilla', 'Avenida de la Paz 50', 'Sevilla', '954123456', 'secretaria@iessevilla.es');

-- 2. Empresas
INSERT INTO empresas (cif, razon_social, direccion, localidad, email_contacto) VALUES 
('CIF001', 'Tech Solutions S.L.', 'Parque Tecnológico 1', 'Madrid', 'rrhh@tech.com'),
('CIF002', 'Sistemas Avanzados SA', 'Calle Mayor 5', 'Madrid', 'info@sistemas.es'),
('CIF003', 'Andalucía Software', 'Isla de la Cartuja', 'Sevilla', 'jobs@andsoft.es'),
('CIF004', 'Cloud Services', 'Calle Nube 9', 'Sevilla', 'admin@cloud.es'),
('CIF005', 'Data Mining Corp', 'Polígono Industrial 4', 'Madrid', 'data@corp.com'),
('CIF006', 'Odoo Partners', 'Avenida Principal 10', 'Sevilla', 'contacto@odoo.es');

-- 3. Personal Docente (DOC001 al DOC004)
INSERT INTO personal_docente (codigo_docente, nombre, apellidos, email, rol, fk_centro) VALUES 
('DOC001', 'Juan', 'El Gestor', 'juan.gestor@iesmadrid.es', 'GESTOR', 'CEN01'),
('DOC002', 'Ana', 'García', 'ana.tutor@iesmadrid.es', 'TUTOR', 'CEN01'),
('DOC003', 'Luis', 'Pérez', 'luis.tutor@iesmadrid.es', 'TUTOR', 'CEN01'),
('DOC004', 'Marta', 'López', 'marta.tutor@iesmadrid.es', 'TUTOR', 'CEN01'),
('DOC005', 'Pedro', 'Ramírez', 'pedro.tutor@iessevilla.es', 'TUTOR', 'CEN02'),
('DOC006', 'Sofía', 'Castro', 'sofía.tutor@iessevilla.es', 'TUTOR', 'CEN02'),
('DOC007', 'Raúl', 'Sanz', 'raul.tutor@iessevilla.es', 'TUTOR', 'CEN02'),
('DOC008', 'Elena', 'Blanco', 'elena.tutor@iessevilla.es', 'TUTOR', 'CEN02');

-- 4. Tutores de Empresa (TUT001 y TUT002)
INSERT INTO tutores_empresa (codigo_tutor, nombre, apellidos, email, fk_empresa) VALUES 
('TUT001', 'Carlos', 'Empresa1', 'carlos@tech.com', 'CIF001'),
('TUT002', 'Beatriz', 'Empresa2', 'bea@sistemas.es', 'CIF002'),
('TUT003', 'Sergio', 'Empresa3', 'sergio@andsoft.es', 'CIF003'),
('TUT004', 'Laura', 'Empresa4', 'laura@cloud.es', 'CIF004'),
('TUT005', 'Pablo', 'Empresa5', 'pablo@corp.com', 'CIF005'),
('TUT006', 'Irene', 'Empresa6', 'irene@odoo.es', 'CIF006');

-- 5. Alumnos (REFERENCIAS CORREGIDAS A DOC Y TUT)
INSERT INTO alumnos (id_codigo_alumno, nombre, apellidos, email, fk_centro, fk_empresa, fk_profesor, fk_tutor) VALUES 
('ALU01', 'Alumno', 'Uno', 'alu01@gmail.com', 'CEN01', 'CIF001', 'DOC002', 'TUT001'),
('ALU02', 'Alumno', 'Dos', 'alu02@gmail.com', 'CEN01', 'CIF001', 'DOC002', 'TUT001'),
('ALU03', 'Alumno', 'Tres', 'alu03@gmail.com', 'CEN01', 'CIF002', 'DOC002', 'TUT002'),
('ALU04', 'Alumno', 'Cuatro', 'alu04@gmail.com', 'CEN01', 'CIF002', 'DOC003', 'TUT002'),
('ALU05', 'Alumno', 'Cinco', 'alu05@gmail.com', 'CEN01', 'CIF005', 'DOC003', 'TUT005'),
('ALU06', 'Alumno', 'Seis', 'alu06@gmail.com', 'CEN01', 'CIF005', 'DOC004', 'TUT005'),
('ALU07', 'Alumno', 'Siete', 'alu07@gmail.com', 'CEN01', 'CIF001', 'DOC004', 'TUT001'),
('ALU08', 'Alumno', 'Ocho', 'alu08@gmail.com', 'CEN01', 'CIF002', 'DOC002', 'TUT002'),
('ALU09', 'Alumno', 'Nueve', 'alu09@gmail.com', 'CEN01', 'CIF005', 'DOC003', 'TUT005'),
('ALU10', 'Alumno', 'Diez', 'alu10@gmail.com', 'CEN01', 'CIF001', 'DOC004', 'TUT001'),
('ALU11', 'Alumno', 'Once', 'alu11@gmail.com', 'CEN02', 'CIF003', 'DOC005', 'TUT003'),
('ALU12', 'Alumno', 'Doce', 'alu12@gmail.com', 'CEN02', 'CIF003', 'DOC005', 'TUT003'),
('ALU13', 'Alumno', 'Trece', 'alu13@gmail.com', 'CEN02', 'CIF004', 'DOC006', 'TUT004'),
('ALU14', 'Alumno', 'Catorce', 'alu14@gmail.com', 'CEN02', 'CIF004', 'DOC006', 'TUT004'),
('ALU15', 'Alumno', 'Quince', 'alu15@gmail.com', 'CEN02', 'CIF006', 'DOC007', 'TUT006'),
('ALU16', 'Alumno', 'Dieciséis', 'alu16@gmail.com', 'CEN02', 'CIF006', 'DOC007', 'TUT006'),
('ALU17', 'Alumno', 'Diecisiete', 'alu17@gmail.com', 'CEN02', 'CIF003', 'DOC008', 'TUT003'),
('ALU18', 'Alumno', 'Dieciocho', 'alu18@gmail.com', 'CEN02', 'CIF004', 'DOC008', 'TUT004'),
('ALU19', 'Alumno', 'Diecinueve', 'alu19@gmail.com', 'CEN02', 'CIF006', 'DOC005', 'TUT006'),
('ALU20', 'Alumno', 'Veinte', 'alu20@gmail.com', 'CEN02', 'CIF003', 'DOC006', 'TUT003');