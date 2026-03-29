package com.dam.proyecto.backend.service.impl;
import com.dam.proyecto.backend.dto.tarea.TareaDTO;
import com.dam.proyecto.backend.dto.tarea.TareaMapper;
import com.dam.proyecto.backend.model.Tarea;
import com.dam.proyecto.backend.repository.TareaRepository;
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

    // 1. CREACIÓN PURA
    @Override
    @Transactional
    public Tarea crearTarea(Tarea tarea) {
        log.info("Persistiendo nueva tarea en borrador: {}", tarea.getTitulo());
        // Solo guarda, no dispara estados ni fechas aún
        return tareaRepository.save(tarea);
    }

    // 2. ASIGNACIÓN (Lógica de Negocio)
    @Override
    @Transactional
    public Tarea asignarTarea(Long idTarea) {
        Tarea tarea = tareaRepository.findById(idTarea)
                .orElseThrow(() -> new RuntimeException("No se puede asignar: Tarea no encontrada"));

        log.info("Tutor de Empresa activando/asignando tarea ID: {}", idTarea);

        tarea.setEstado("ASIGNADA");
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
                .orElseThrow(() -> new RuntimeException("No se puede modificar: Tarea no encontrada"));

        log.info("Modificando contenido de la tarea ID: {}", idTarea);
        existente.setTitulo(tareaModificada.getTitulo());
        existente.setDescripcion(tareaModificada.getDescripcion());
        // Podrías añadir más campos editables según tu entidad

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
    public Tarea actualizarEstadoAlumno(Long idTarea, String nuevoEstado, Double horasReales) {
        Tarea tarea = tareaRepository.findById(idTarea)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada con ID: " + idTarea));

        log.info("Alumno cambiando estado de tarea {} a {}", idTarea, nuevoEstado);

        if ("COMPLETADA".equalsIgnoreCase(nuevoEstado)) {
            if (horasReales == null || horasReales <= 0) {
                throw new IllegalArgumentException("Para completar la tarea debes indicar las horas reales.");
            }
            tarea.setHorasReales(horasReales);
        }

        tarea.setEstado(nuevoEstado.toUpperCase());
        return tareaRepository.save(tarea);
    }

    // 6. VALIDACIÓN (Tu lógica original de Profesor)
    @Override
    @Transactional
    public Tarea revisarTarea(Long idTarea) {
        Tarea tarea = tareaRepository.findById(idTarea)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));

        if (!"COMPLETADA".equalsIgnoreCase(tarea.getEstado())) {
            throw new IllegalStateException("Solo se pueden revisar tareas COMPLETADAS.");
        }

        tarea.setEstado("REVISADA");
        return tareaRepository.save(tarea);
    }

    // --- MÉTODOS DE CONSULTA (Usando los métodos del Repo con @Query) ---

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
    public List<TareaDTO> obtenerPorAlumnoYEstado(String idAlumno, String estado) {
        List<Tarea> tareas = tareaRepository.findByAlumno_IdAndEstado(idAlumno, estado);
        return tareas.stream()
                .map(tareaMapper::convertirATareaDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TareaDTO> obtenerPorTutorEmpresaYEstado(String idTutorEmpresa, String estado) {
        List<Tarea> tareas = tareaRepository.findByTutorEmpresa_IdAndEstado(idTutorEmpresa, estado);
        return tareas.stream()
                .map(tareaMapper::convertirATareaDTO)
                .collect(Collectors.toList());
    }
}
