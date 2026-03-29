package com.dam.proyecto.backend.dto.login;

import com.dam.proyecto.backend.model.users.Alumno;
import com.dam.proyecto.backend.model.users.Profesor;
import com.dam.proyecto.backend.model.users.TutorEmpresa;

/**
 * Mapper manual para convertir entre entidades de usuario y Login DTOs.
 * Permite mapear de modelo a DTO y viceversa.
 */
public class LoginMapper {

    /**
     * Convierte un Alumno a LoginResponseDTO.
     *
     * @param alumno Alumno a mapear
     * @return LoginResponseDTO con información relevante del alumno
     */
    public static LoginResponseDTO toDTO(Alumno alumno) {
        if (alumno == null) return null;

        LoginResponseDTO.AlumnoInfo alumnoInfo = new LoginResponseDTO.AlumnoInfo(
                alumno.getProfesor() != null ? alumno.getProfesor().getNombre() : null,
                alumno.getProfesor() != null ? alumno.getProfesor().getApellidos() : null,
                alumno.getTutorEmpresa() != null ? alumno.getTutorEmpresa().getNombre() : null,
                alumno.getTutorEmpresa() != null ? alumno.getTutorEmpresa().getApellidos() : null,
                alumno.getEmpresa() != null ? alumno.getEmpresa().getRazonSocial() : null,
                alumno.getCentro() != null ? alumno.getCentro().getNombre() : null
        );

        return new LoginResponseDTO(
                alumno.getId(),
                alumno.getNombre(),
                alumno.getApellidos(),
                alumno.getEmail(),
                "ALUMNO",
                alumnoInfo,
                null,
                null
        );
    }

    /**
     * Convierte un Profesor a LoginResponseDTO.
     *
     * @param profesor Profesor a mapear
     * @return LoginResponseDTO con información relevante del profesor
     */
    public static LoginResponseDTO toDTO(Profesor profesor) {
        if (profesor == null) return null;

        LoginResponseDTO.ProfesorInfo profesorInfo = new LoginResponseDTO.ProfesorInfo(
                profesor.getCentro() != null ? profesor.getCentro().getNombre() : null
        );

        return new LoginResponseDTO(
                profesor.getId(),
                profesor.getNombre(),
                profesor.getApellidos(),
                profesor.getEmail(),
                "PROFESOR",
                null,
                profesorInfo,
                null
        );
    }

    /**
     * Convierte un TutorEmpresa a LoginResponseDTO.
     *
     * @param tutor TutorEmpresa a mapear
     * @return LoginResponseDTO con información relevante del tutor
     */
    public static LoginResponseDTO toDTO(TutorEmpresa tutor) {
        if (tutor == null) return null;

        LoginResponseDTO.TutorEmpresaInfo tutorInfo = new LoginResponseDTO.TutorEmpresaInfo(
                tutor.getEmpresa() != null ? tutor.getEmpresa().getRazonSocial() : null
        );

        return new LoginResponseDTO(
                tutor.getId(),
                tutor.getNombre(),
                tutor.getApellidos(),
                tutor.getEmail(),
                "TUTOR_EMPRESA",
                null,
                null,
                tutorInfo
        );
    }

    /**
     * Convierte un LoginRequestDTO a entidad genérica de Usuario.
     * Para el MVP, se devuelve null porque la creación real depende del rol y se hace en el servicio correspondiente.
     * Este método sirve como plantilla para futuras extensiones.
     *
     * @param request LoginRequestDTO con las credenciales
     * @return null (debe implementarse según rol y lógica del backend)
     */
    public static Object toModel(LoginRequestDTO request) {
        // Nota: En este MVP no se necesita mapear a modelo directamente desde login
        return null;
    }
}