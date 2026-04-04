package com.dam.proyecto.backend.mapper;

import com.dam.proyecto.backend.dto.login.LoginMapper;
import com.dam.proyecto.backend.dto.login.LoginResponseDTO;
import com.dam.proyecto.backend.model.users.Alumno;
import com.dam.proyecto.backend.model.users.Profesor;
import com.dam.proyecto.backend.model.users.TutorEmpresa;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LoginMapperTest {

    @Test
    void testAlumnoToDto() {
        // Creamos un alumno de ejemplo (rellenar con tus datos reales)
        Alumno alumno = new Alumno();
        alumno.setId("ALU001");
        alumno.setNombre("Juan");
        alumno.setApellidos("Pérez");
        alumno.setEmail("juan.perez@email.com");
        alumno.setRol(null); // o RolUsuario.ALUMNO si lo tienes
        alumno.setProfesor(null); // puedes asignar un Profesor real si quieres
        alumno.setTutorEmpresa(null); // puedes asignar un Tutor real si quieres
        alumno.setEmpresa(null); // asignar Empresa real si la tienes
        alumno.setCentro(null); // asignar Centro real si lo tienes

        // Mapeo a DTO
        LoginResponseDTO dto = LoginMapper.toDTO(alumno);

        assertEquals(alumno.getId(), dto.getId());
        assertEquals(alumno.getNombre(), dto.getNombre());
        assertEquals(alumno.getApellidos(), dto.getApellidos());
        assertEquals(alumno.getEmail(), dto.getEmail());
        assertNotNull(dto.getAlumnoInfo()); // AlumnoInfo no es null
    }

    @Test
    void testProfesorToDto() {
        Profesor profesor = new Profesor();
        profesor.setId("PROF001");
        profesor.setNombre("Ana");
        profesor.setApellidos("García");
        profesor.setEmail("ana.garcia@email.com");
        profesor.setCentro(null); // asignar Centro real si lo tienes

        LoginResponseDTO dto = LoginMapper.toDTO(profesor);

        assertEquals(profesor.getId(), dto.getId());
        assertEquals(profesor.getNombre(), dto.getNombre());
        assertEquals(profesor.getApellidos(), dto.getApellidos());
        assertEquals(profesor.getEmail(), dto.getEmail());
        assertNotNull(dto.getProfesorInfo());
    }

    @Test
    void testTutorEmpresaToDto() {
        TutorEmpresa tutor = new TutorEmpresa();
        tutor.setId("TUT001");
        tutor.setNombre("Luis");
        tutor.setApellidos("Martínez");
        tutor.setEmail("luis.martinez@email.com");
        tutor.setEmpresa(null); // asignar Empresa real si la tienes

        LoginResponseDTO dto = LoginMapper.toDTO(tutor);

        assertEquals(tutor.getId(), dto.getId());
        assertEquals(tutor.getNombre(), dto.getNombre());
        assertEquals(tutor.getApellidos(), dto.getApellidos());
        assertEquals(tutor.getEmail(), dto.getEmail());
        assertNotNull(dto.getTutorInfo());
    }
}
