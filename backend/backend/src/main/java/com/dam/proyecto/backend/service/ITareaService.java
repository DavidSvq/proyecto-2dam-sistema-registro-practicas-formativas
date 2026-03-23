package com.dam.proyecto.backend.service;

import com.dam.proyecto.backend.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface ITareaService {

    // 1. PERSISTENCIA PURA (Nueva)
    // Solo guarda el objeto en la BD sin tocar estados ni fechas
    Tarea crearTarea(Tarea tarea);

    // 2. ASIGNACIÓN (Tutor de Empresa) - Modificado
    // Aquí es donde se aplica la lógica de 'ASIGNADA', fecha y horas 0.0
    Tarea asignarTarea(Long idTarea);

    // 3. EDICIÓN Y BORRADO (Nuevas)
    Tarea modificarTarea(Long idTarea, Tarea tareaModificada);
    void eliminarTarea(Long idTarea);

    // 4. GESTIÓN DE ESTADOS (Alumno) - Manteniendo tus parámetros
    Tarea actualizarEstadoAlumno(Long idTarea, String nuevoEstado, Double horasReales);

    // 5. VALIDACIÓN (Profesor-Tutor)
    Tarea revisarTarea(Long idTarea);

    // 6. CONSULTAS Y FILTROS - Respetando tus nombres de parámetros
    List<Tarea> obtenerTodasPorAlumno(String idAlumno);
    List<Tarea> obtenerPorAlumnoYEstado(String idAlumno, String estado);
    List<Tarea> obtenerPorTutorEmpresaYEstado(String idTutorEmpresa, String estado);
}
