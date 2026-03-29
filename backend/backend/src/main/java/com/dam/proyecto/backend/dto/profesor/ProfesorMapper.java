package com.dam.proyecto.backend.dto.profesor;

import com.dam.proyecto.backend.dto.centro.CentroDocenteMapper;

import com.dam.proyecto.backend.model.users.Profesor;
import org.springframework.stereotype.Component;

@Component
public class ProfesorMapper {

    private final CentroDocenteMapper centroDocenteMapper;

    public ProfesorMapper(CentroDocenteMapper centroDocenteMapper) {
        this.centroDocenteMapper = centroDocenteMapper;
    }

    // Convierte la entidad Profesor a ProfesorDTO
    public ProfesorDTO convertirAProfesorDTO(Profesor profesor) {
        if (profesor == null) {
            return null;
        }

        // Mapeamos el objeto Profesor a ProfesorDTO
        ProfesorDTO profesorDTO = new ProfesorDTO(
                profesor.getId(),
                profesor.getNombre(),
                profesor.getApellidos(),
                profesor.getEmail(),
                profesor.getPassword(),
                profesor.getRol(),
                profesor.getNumAlumnos(),
                centroDocenteMapper.convertirACentroDocenteDTO(profesor.getCentro())
        );

        return profesorDTO;
    }

    // Convierte el ProfesorDTO a la entidad Profesor
    public Profesor convertirAProfesor(ProfesorDTO profesorDTO) {
        if (profesorDTO == null) {
            return null;
        }

        // Creamos el objeto Profesor a partir del DTO
        Profesor profesor = new Profesor();
        profesor.setId(profesorDTO.getId());
        profesor.setNombre(profesorDTO.getNombre());
        profesor.setApellidos(profesorDTO.getApellidos());
        profesor.setEmail(profesorDTO.getEmail());
        profesor.setPassword(profesorDTO.getPassword());
        profesor.setRol(profesorDTO.getRol());
        profesor.setNumAlumnos(profesorDTO.getNumAlumnos());
        // Aquí usamos el mapper para convertir el CentroDocenteDTO de vuelta a la entidad CentroDocente
        profesor.setCentro(centroDocenteMapper.convertirACentroDocente(profesorDTO.getCentro()));

        return profesor;
    }
}