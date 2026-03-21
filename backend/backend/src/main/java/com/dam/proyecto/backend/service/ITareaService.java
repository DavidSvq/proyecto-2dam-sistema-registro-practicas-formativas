package com.dam.proyecto.backend.service;

import com.dam.proyecto.backend.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface ITareaService {
    // 1. ASIGNACIÓN (Tutor de Empresa)
    // El estado inicial será 'ASIGNADA'
    Tarea asignarTarea(Tarea tarea);

    // 2. GESTIÓN DE ESTADOS (Alumno)
    // Para cambiar a: EN_PROGRESO, COMPLETADA, REASIGNADA, CANCELADA
    // Si el estado es 'COMPLETADA', se guardan las horasReales
    Tarea actualizarEstadoAlumno(Long idTarea, String nuevoEstado, Double horasReales);

    // 3. VALIDACIÓN (Profesor-Tutor)
    // Pasa la tarea de 'COMPLETADA' a 'REVISADA'
    Tarea revisarTarea(Long idTarea);

    // 4. CONSULTAS Y FILTROS
    // Listado general por fecha descendente
    List<Tarea> obtenerTodasPorAlumno(String idAlumno);

    // Búsqueda específica por estado (Tu petición)
    // Útil para los botones de filtro: "Ver Pendientes", "Ver Canceladas", etc.
    List<Tarea> obtenerPorAlumnoYEstado(String idAlumno, String estado);

    // Consulta para el Tutor de Empresa (Ver qué ha asignado él)
    List<Tarea> obtenerPorTutorEmpresaYEstado(String idTutorEmpresa, String estado);
}
