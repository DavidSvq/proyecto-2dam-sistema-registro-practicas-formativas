package com.dam.proyecto.backend.dto.login;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO utilizado para devolver la información del usuario tras un inicio de sesión exitoso.
 * Contiene campos comunes a todos los roles y campos adicionales según el rol del usuario.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {

    /**
     * Identificador único del usuario.
     */
    private String id;

    /**
     * Nombre del usuario.
     */
    private String nombre;

    /**
     * Apellidos del usuario.
     */
    private String apellidos;

    /**
     * Correo electrónico del usuario.
     */
    private String email;

    /**
     * Rol del usuario dentro del sistema (ALUMNO, PROFESOR, TUTOR_EMPRESA).
     */
    private String rol; // Se puede cambiar a Enum si ya existe RolUsuario

    /**
     * Datos adicionales si el usuario es Alumno.
     */
    private AlumnoInfo alumnoInfo;

    /**
     * Datos adicionales si el usuario es Profesor.
     */
    private ProfesorInfo profesorInfo;

    /**
     * Datos adicionales si el usuario es TutorEmpresa.
     */
    private TutorEmpresaInfo tutorInfo;

    /**
     * Información relevante de un alumno.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AlumnoInfo {
        private String profesorNombre;
        private String profesorApellidos;
        private String tutorNombre;
        private String tutorApellidos;
        private String empresaNombre;
        private String centroNombre;
    }

    /**
     * Información relevante de un profesor.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProfesorInfo {
        private String centroNombre;
    }

    /**
     * Información relevante de un tutor de empresa.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TutorEmpresaInfo {
        private String empresaNombre;
    }
}
