package com.dam.proyecto.backend.service;
import com.dam.proyecto.backend.model.Asistencia;
import com.dam.proyecto.backend.model.Tarea;
import com.dam.proyecto.backend.model.users.Alumno;
import com.dam.proyecto.backend.repository.AsistenciaRepository;
import com.dam.proyecto.backend.repository.TareaRepository;
import com.dam.proyecto.backend.repository.users.AlumnoRepository;
import com.dam.proyecto.backend.service.IAsistenciaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.ReadOnlyProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TareaServiceImpl implements ITareaService {

    private final TareaRepository tareaRepository;

    @Override
    @Transactional
    public Tarea asignarTarea(Tarea tarea) {
        log.info("Tutor de Empresa asignando nueva tarea: {}", tarea.getTitulo());
        tarea.setEstado("ASIGNADA");
        tarea.setFechaAsignacion(LocalDate.now());
        tarea.setHorasReales(0.0);
        // Aquí en el futuro llamarás al microservicio de ML para setear horasEstimadasIA
        return tareaRepository.save(tarea);
    }

    @Override
    @Transactional
    public Tarea actualizarEstadoAlumno(Long idTarea, String nuevoEstado, Double horasReales) {
        Tarea tarea = tareaRepository.findById(idTarea)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada con ID: " + idTarea));

        log.info("Alumno cambiando estado de tarea {} a {}", idTarea, nuevoEstado);

        // Lógica de negocio para las horas reales
        if ("COMPLETADA".equalsIgnoreCase(nuevoEstado)) {
            if (horasReales == null || horasReales <= 0) {
                throw new IllegalArgumentException("Para completar la tarea debes indicar las horas reales invertidas.");
            }
            tarea.setHorasReales(horasReales);
        }

        tarea.setEstado(nuevoEstado.toUpperCase());
        return tareaRepository.save(tarea);
    }

    @Override
    @Transactional
    public Tarea revisarTarea(Long idTarea) {
        Tarea tarea = tareaRepository.findById(idTarea)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));

        if (!"COMPLETADA".equalsIgnoreCase(tarea.getEstado())) {
            throw new IllegalStateException("El profesor solo puede revisar tareas que el alumno haya marcado como COMPLETADA.");
        }

        log.info("Profesor-Tutor validando tarea ID: {}", idTarea);
        tarea.setEstado("REVISADA");
        return tareaRepository.save(tarea);
    }

    @Override
    @ReadOnlyProperty
    public List<Tarea> obtenerTodasPorAlumno(String idAlumno) {
        return tareaRepository.findByAlumno_IdOrderByFechaAsignacionDesc(idAlumno);
    }

    @Override
    @ReadOnlyProperty
    public List<Tarea> obtenerPorAlumnoYEstado(String idAlumno, String estado) {
        return tareaRepository.findByAlumno_IdAndEstado(idAlumno, estado.toUpperCase());
    }

    @Override
    @ReadOnlyProperty
    public List<Tarea> obtenerPorTutorEmpresaYEstado(String idTutorEmpresa, String estado) {
        return tareaRepository.findByTutorEmpresa_IdAndEstado(idTutorEmpresa, estado.toUpperCase());
    }
}
