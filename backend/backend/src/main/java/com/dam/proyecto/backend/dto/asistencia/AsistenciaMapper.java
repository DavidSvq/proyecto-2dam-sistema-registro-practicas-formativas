package com.dam.proyecto.backend.dto.asistencia;

import com.dam.proyecto.backend.dto.alumno.AlumnoMapper;
import com.dam.proyecto.backend.model.Asistencia;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AsistenciaMapper {

    private final AlumnoMapper alumnoMapper;

    // Convierte la entidad Asistencia a AsistenciaDTO
    public AsistenciaDTO convertirAAsistenciaDTO(Asistencia asistencia) {
        if (asistencia == null) {
            return null;
        }

        return new AsistenciaDTO(
                asistencia.getIdAsistencia(),
                asistencia.getFecha(),
                asistencia.getHoraEntrada(),
                asistencia.getHoraSalida(),
                asistencia.getHorasDiarias(),
                alumnoMapper.convertirAAlumnoDTO(asistencia.getAlumno()),
                asistencia.getObservaciones()
        );
    }

    // Convierte el AsistenciaDTO a la entidad Asistencia
    public Asistencia convertirAAsistencia(AsistenciaDTO asistenciaDTO) {
        if (asistenciaDTO == null) {
            return null;
        }

        Asistencia asistencia = new Asistencia();
        asistencia.setIdAsistencia(asistenciaDTO.getIdAsistencia());
        asistencia.setFecha(asistenciaDTO.getFecha());
        asistencia.setHoraEntrada(asistenciaDTO.getHoraEntrada());
        asistencia.setHoraSalida(asistenciaDTO.getHoraSalida());
        asistencia.setHorasDiarias(asistenciaDTO.getHorasDiarias());
        asistencia.setObservaciones(asistenciaDTO.getObservaciones());
        // Aquí usamos el mapper para convertir el AlumnoDTO de vuelta a la entidad Alumno
        asistencia.setAlumno(alumnoMapper.convertirAAlumno(asistenciaDTO.getAlumno()));

        return asistencia;
    }
}
