package com.dam.proyecto.backend.service.impl;
import com.dam.proyecto.backend.dto.alumno.AlumnoMapper;
import com.dam.proyecto.backend.dto.tarea.TareaDTO;
import com.dam.proyecto.backend.dto.tarea.TareaMapper;
import com.dam.proyecto.backend.model.Tarea;
import com.dam.proyecto.backend.model.enums.EstadoTarea;
import com.dam.proyecto.backend.model.users.Alumno;
import com.dam.proyecto.backend.model.users.TutorEmpresa;
import com.dam.proyecto.backend.repository.TareaRepository;
import com.dam.proyecto.backend.repository.users.AlumnoRepository;
import com.dam.proyecto.backend.repository.users.TutorEmpresaRepository;
import com.dam.proyecto.backend.service.ITareaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.annotation.ReadOnlyProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TareaServiceImpl implements ITareaService {

    private final TareaRepository tareaRepository;
    private final TareaMapper tareaMapper;
    private final AlumnoRepository alumnoRepository;
    private final TutorEmpresaRepository tutorEmpresaRepository;

    @Override
    @Transactional
    public Tarea crearTarea(Tarea tarea) {
        log.info("Iniciando creación de tarea: {}", tarea.getTitulo());

        // 1. Validar y recuperar Alumno
        if (tarea.getAlumno() != null && tarea.getAlumno().getId() != null) {
            // Buscamos por el ID heredado
            Alumno alumnoReal = alumnoRepository.findById(tarea.getAlumno().getId())
                    .orElseThrow(() -> new RuntimeException("Alumno no encontrado con ID: " + tarea.getAlumno().getId()));
            tarea.setAlumno(alumnoReal);
        }

        // 2. Validar y recuperar Tutor
        if (tarea.getTutorEmpresa() != null && tarea.getTutorEmpresa().getId() != null) {
            TutorEmpresa tutorReal = tutorEmpresaRepository.findById(tarea.getTutorEmpresa().getId())
                    .orElseThrow(() -> new RuntimeException("Tutor no encontrado con ID: " + tarea.getTutorEmpresa().getId()));
            tarea.setTutorEmpresa(tutorReal);
        }

        tarea.setFechaAsignacion(LocalDate.now());
        if (tarea.getEstado() == null) {
            tarea.setEstado(EstadoTarea.ASIGNADA);
        }

        return tareaRepository.save(tarea);
    }

    // 2. ASIGNACIÓN (Lógica de Negocio)
    @Override
    @Transactional
    public Tarea asignarTarea(Long idTarea) {
        Tarea tarea = tareaRepository.findById(idTarea)
                .orElseThrow(() -> new RuntimeException("No se puede asignar: Tarea no encontrada"));

        log.info("Tutor de Empresa activando/asignando tarea ID: {}", idTarea);

        tarea.setEstado(EstadoTarea.ASIGNADA);
        tarea.setFechaAsignacion(LocalDate.now());
        tarea.setHorasReales(0.0);

        // Aquí es donde en el futuro integrarás el microservicio de IA para horas estimadas
        return tareaRepository.save(tarea);
    }
    // 3. EDICIÓN
    @Override
    @Transactional
    public Tarea modificarTarea(Long idTarea, Tarea tareaModificada) {
        Tarea existente = tareaRepository.findById(idTarea)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada con ID: " + idTarea));

        log.info("Actualizando tarea ID: {} con nuevo estado: {}", idTarea, tareaModificada.getEstado());

        existente.setTitulo(tareaModificada.getTitulo());
        existente.setDescripcion(tareaModificada.getDescripcion());

        // Actualizamos el Estado (Esto es lo que te faltaba)
        if (tareaModificada.getEstado() != null) {
            existente.setEstado(tareaModificada.getEstado());
        }

        if (tareaModificada.getFechaLimite() != null) {
            existente.setFechaLimite(tareaModificada.getFechaLimite());
        }

        if (tareaModificada.getAlumno() != null) {
            existente.setAlumno(tareaModificada.getAlumno());
        }

        return tareaRepository.save(existente);
    }


    // 4. ELIMINACIÓN
    @Override
    @Transactional
    public void eliminarTarea(Long idTarea) {
        if (!tareaRepository.existsById(idTarea)) {
            throw new RuntimeException("La tarea a eliminar no existe.");
        }
        log.warn("Eliminando tarea ID: {}", idTarea);
        tareaRepository.deleteById(idTarea);
    }

    // 5. GESTIÓN DE ESTADOS (Tu lógica original de Alumno)
    @Override
    @Transactional
    public Tarea actualizarEstadoAlumno(Long idTarea, EstadoTarea nuevoEstado, Double horasReales) {
        Tarea tarea = tareaRepository.findById(idTarea)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada con ID: " + idTarea));

        log.info("Alumno cambiando estado de tarea {} a {}", idTarea, nuevoEstado);

        if (EstadoTarea.COMPLETADA.equals(nuevoEstado)) {
            if (horasReales == null || horasReales <= 0) {
                throw new IllegalArgumentException("Para completar la tarea debes indicar las horas reales.");
            }
            tarea.setHorasReales(horasReales);
        }

        tarea.setEstado(nuevoEstado);
        return tareaRepository.save(tarea);
    }

    // 6. VALIDACIÓN (Tu lógica original de Profesor)
    @Override
    @Transactional
    public Tarea revisarTarea(Long idTarea) {
        Tarea tarea = tareaRepository.findById(idTarea)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));

        if (tarea.getEstado() != EstadoTarea.COMPLETADA) {
            throw new IllegalStateException("Solo se pueden revisar tareas COMPLETADAS.");
        }

        tarea.setEstado(EstadoTarea.VALIDADA);
        return tareaRepository.save(tarea);
    }

    @Override
    @Transactional
    public Tarea actualizarEstadoTutor(Long idTarea, EstadoTarea nuevoEstado) {
        Tarea tarea = tareaRepository.findById(idTarea)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));

        // Lógica de negocio: Un tutor solo debería cancelar si no está VALIDADA
        if (tarea.getEstado() == EstadoTarea.VALIDADA) {
            throw new RuntimeException("No se puede cambiar el estado de una tarea ya validada por el profesor");
        }

        log.info("Tutor cambiando estado de tarea {} a {}", idTarea, nuevoEstado);
        tarea.setEstado(nuevoEstado);

        return tareaRepository.save(tarea);
    }

    // --- MÉTODOS DE CONSULTA (Usando los métodos del Repo con @Query) ---

    @Override
    public List<TareaDTO> obtenerTodasPorTutorEmpresa(String idTutor) {
        // 1. Buscamos todas las tareas del tutor en la BD
        List<Tarea> tareas = tareaRepository.findByTutorEmpresaId(idTutor);

        // 2. Mapeamos la lista de entidades a una lista de DTOs
        return tareas.stream()
                .map(tareaMapper::convertirATareaDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TareaDTO> obtenerTodasPorAlumno(String idAlumno) {
        List<Tarea> tareas = tareaRepository.findByAlumno_IdOrderByFechaAsignacionDesc(idAlumno);
        return tareas.stream()
                .map(tareaMapper::convertirATareaDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TareaDTO> obtenerPorAlumnoYEstado(String idAlumno, EstadoTarea estado) {
        List<Tarea> tareas = tareaRepository.findByAlumno_IdAndEstado(idAlumno, estado);
        return tareas.stream()
                .map(tareaMapper::convertirATareaDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TareaDTO> obtenerPorTutorEmpresaYEstado(String idTutorEmpresa, EstadoTarea estado) {
        List<Tarea> tareas = tareaRepository.findByTutorEmpresa_IdAndEstado(idTutorEmpresa, estado);
        return tareas.stream()
                .map(tareaMapper::convertirATareaDTO)
                .collect(Collectors.toList());
    }
}
