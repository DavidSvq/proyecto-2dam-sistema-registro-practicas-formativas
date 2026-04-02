package com.dam.proyecto.backend.dto.tarea;

import com.dam.proyecto.backend.dto.alumno.AlumnoMapper;
import com.dam.proyecto.backend.dto.profesor.ProfesorMapper;
import com.dam.proyecto.backend.dto.tutor.TutorEmpresaMapper;
import com.dam.proyecto.backend.model.Tarea;
import com.dam.proyecto.backend.model.enums.EstadoTarea;
import org.springframework.stereotype.Component;

@Component
public class TareaMapper {

    private final AlumnoMapper alumnoMapper;
    private final TutorEmpresaMapper tutorEmpresaMapper;
    private final ProfesorMapper profesorMapper;

    public TareaMapper(AlumnoMapper alumnoMapper, TutorEmpresaMapper tutorEmpresaMapper, ProfesorMapper profesorMapper) {
        this.alumnoMapper = alumnoMapper;
        this.tutorEmpresaMapper = tutorEmpresaMapper;
        this.profesorMapper = profesorMapper;
    }

    // Convierte la entidad Tarea a TareaDTO
    public TareaDTO convertirATareaDTO(Tarea tarea) {
        if (tarea == null) {
            return null;
        }

        return new TareaDTO(
                tarea.getIdTarea(),
                tarea.getTitulo(),
                tarea.getDescripcion(),
                tarea.getFechaAsignacion(),
                tarea.getFechaLimite(),
                tarea.getEstado().name(),
                tarea.getHorasEstimadasIA(),
                tarea.getHorasReales(),
                alumnoMapper.convertirAAlumnoDTO(tarea.getAlumno()),
                tutorEmpresaMapper.convertirATutorEmpresaDTO(tarea.getTutorEmpresa()),
                profesorMapper.convertirAProfesorDTO(tarea.getProfesorTutor())
        );
    }

    // Convierte el TareaDTO a la entidad Tarea
    public Tarea convertirATarea(TareaDTO tareaDTO) {
        if (tareaDTO == null) {
            return null;
        }

        Tarea tarea = new Tarea();
        tarea.setIdTarea(tareaDTO.getIdTarea());
        tarea.setTitulo(tareaDTO.getTitulo());
        tarea.setDescripcion(tareaDTO.getDescripcion());
        tarea.setFechaAsignacion(tareaDTO.getFechaAsignacion());
        tarea.setFechaLimite(tareaDTO.getFechaLimite());
        if (tareaDTO.getEstado() != null) {
            tarea.setEstado(EstadoTarea.valueOf(tareaDTO.getEstado().toUpperCase()));
        }
        tarea.setHorasEstimadasIA(tareaDTO.getHorasEstimadasIA());
        tarea.setHorasReales(tareaDTO.getHorasReales());
        tarea.setAlumno(alumnoMapper.convertirAAlumno(tareaDTO.getAlumno()));
        tarea.setTutorEmpresa(tutorEmpresaMapper.convertirATutorEmpresa(tareaDTO.getTutorEmpresa()));
        tarea.setProfesorTutor(profesorMapper.convertirAProfesor(tareaDTO.getProfesorTutor()));

        return tarea;
    }
}
