-- 1. Entidad Centro Docente (Con todos los campos de RI)
CREATE TABLE IF NOT EXISTS centros (
    codigo_centro VARCHAR(20) PRIMARY KEY,
    nombre_oficial VARCHAR(150) NOT NULL,
    direccion_postal VARCHAR(255),
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
    estado_convenio ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO'
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
    email_login VARCHAR(100) NOT NULL UNIQUE,
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
INSERT INTO centros (codigo_centro, nombre_oficial, direccion_postal, localidad, telefono, correo_institucional) VALUES 
('28001234', 'IES Tecnológico Siglo XXI', 'Av. de la Innovación 1', 'Madrid', '912345678', 'secretaria@iestech.es'),
('41005678', 'IES Al-Andalus Desarrollo', 'Calle Betis 50', 'Sevilla', '954123456', 'info@iesalandalus.es');

-- 2. Empresas
INSERT INTO empresas (cif, razon_social, direccion, localidad, estado_convenio) VALUES 
('A12345678', 'Sistemas Digitales Avanzados S.A.', 'Parque Tecnológico Edificio A', 'Madrid', 'ACTIVO'),
('B98765432', 'Odoo Solutions S.L.', 'Calle Progreso 12', 'Sevilla', 'ACTIVO');

-- 3. Personal Docente (DOC001 al DOC004)
INSERT INTO personal_docente (codigo_docente, nombre, apellidos, email, rol, fk_centro) VALUES 
('DOC001', 'Carlos', 'García Ruiz', 'cgarcia@iestech.es', 'GESTOR', '28001234'),
('DOC002', 'Ana', 'Belén Vara', 'abvara@iestech.es', 'TUTOR', '28001234'),
('DOC003', 'Lucía', 'Martín Sol', 'lmartin@iesalandalus.es', 'GESTOR', '41005678'),
('DOC004', 'Antonio', 'Luna Rey', 'aluna@iesalandalus.es', 'TUTOR', '41005678');

-- 4. Tutores de Empresa (TUT001 y TUT002)
INSERT INTO tutores_empresa (codigo_tutor, nombre, apellidos, email, fk_empresa) VALUES 
('TUT001', 'Roberto', 'Sánchez Tech', 'rsanchez@sistemas.com', 'A12345678'),
('TUT002', 'Marta', 'Odoo Expert', 'marta@odoo-sl.es', 'B98765432');

-- 5. Alumnos (REFERENCIAS CORREGIDAS A DOC Y TUT)
INSERT INTO alumnos (id_codigo_alumno, nombre, apellidos, email_login, horas_totales, fk_centro, fk_empresa, fk_profesor, fk_tutor) VALUES 
('ALU001', 'Ana', 'López Pérez', 'ana.lopez@alumno.es', 10, '28001234', 'A12345678', 'DOC002', 'TUT001'),
('ALU002', 'David', 'Sanz Mota', 'david.sanz@alumno.es', 5, '41005678', 'B98765432', 'DOC004', 'TUT002'),
('ALU003', 'Javier', 'Gómez Ruiz', 'javier.gomez@alumno.es', 40, '41005678', 'A12345678', 'DOC002', 'TUT002'),
('ALU004', 'Elena', 'Rodríguez Gil', 'elena.rod@alumno.es', 120, '28001234', 'A12345678', 'DOC002', 'TUT001'),
('ALU005', 'Marcos', 'Pinto Soler', 'marcos.pinto@alumno.es', 0, '28001234', 'A12345678', 'DOC002', 'TUT001'),
('ALU006', 'Sara', 'Vázquez Mesa', 'sara.vazquez@alumno.es', 200, '41005678', 'B98765432', 'DOC004', 'TUT002');