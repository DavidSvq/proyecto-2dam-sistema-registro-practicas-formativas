package com.dam.proyecto.backend.dto.alumno;

import com.dam.proyecto.backend.dto.centro.CentroDocenteMapper;
import com.dam.proyecto.backend.dto.empresa.EmpresaMapper;
import com.dam.proyecto.backend.dto.profesor.ProfesorMapper;
import com.dam.proyecto.backend.dto.tutor.TutorEmpresaMapper;
import com.dam.proyecto.backend.model.enums.RolUsuario;
import com.dam.proyecto.backend.model.users.Alumno;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;

@Component
//@RequiredArgsConstructor
@DependsOn("centroDocenteMapper")
public class AlumnoMapper {

    @Autowired
    private CentroDocenteMapper centroDocenteMapper;

    @Autowired
    private EmpresaMapper empresaMapper;

    @Autowired
    private ProfesorMapper profesorMapper;

    @Autowired
    private TutorEmpresaMapper tutorEmpresaMapper;

    // Convertir Alumno a AlumnoDTO
    public AlumnoDTO convertirAAlumnoDTO(Alumno alumno) {
        if (alumno == null) {
            return null;
        }

        // Crear el AlumnoDTO
        return new AlumnoDTO(
                alumno.getId(),
                alumno.getNombre(),
                alumno.getApellidos(),
                alumno.getEmail(),
                alumno.getRol().name(), // Si RolUsuario es un enum, usamos .name() para convertirlo a String
                alumno.getHorasTotales(),
                centroDocenteMapper.convertirACentroDocenteDTO(alumno.getCentro()), // Mapeamos la relación con CentroDocente
                empresaMapper.convertirAEmpresaDTO(alumno.getEmpresa()), // Mapeamos la relación con Empresa
                profesorMapper.convertirAProfesorDTO(alumno.getProfesor()), // Mapeamos la relación con Profesor
                tutorEmpresaMapper.convertirATutorEmpresaDTO(alumno.getTutorEmpresa()) // Mapeamos la relación con TutorEmpresa
        );
    }

    // Convertir AlumnoDTO a Alumno (en caso de necesitarlo para crear o actualizar)
    public Alumno convertirAAlumno(AlumnoDTO alumnoDTO) {
        if (alumnoDTO == null) {
            return null;
        }

        // Crear la entidad Alumno
        Alumno alumno = new Alumno();
        alumno.setId(alumnoDTO.getId());
        alumno.setNombre(alumnoDTO.getNombre());
        alumno.setApellidos(alumnoDTO.getApellidos());
        alumno.setEmail(alumnoDTO.getEmail());
        alumno.setRol(RolUsuario.valueOf(alumnoDTO.getRol())); // Convertimos el rol de String a Enum
        alumno.setHorasTotales(alumnoDTO.getHorasTotales());

        // Mapeamos las relaciones (si es necesario para la creación o actualización)
        alumno.setCentro(centroDocenteMapper.convertirACentroDocente(alumnoDTO.getCentro()));
        alumno.setEmpresa(empresaMapper.convertirAEmpresa(alumnoDTO.getEmpresa()));
        alumno.setProfesor(profesorMapper.convertirAProfesor(alumnoDTO.getProfesor()));
        alumno.setTutorEmpresa(tutorEmpresaMapper.convertirATutorEmpresa(alumnoDTO.getTutorEmpresa()));

        return alumno;
    }
}
