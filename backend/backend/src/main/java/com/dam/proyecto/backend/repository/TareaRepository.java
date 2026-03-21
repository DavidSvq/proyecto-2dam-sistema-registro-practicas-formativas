package com.dam.proyecto.backend.repository;

import com.dam.proyecto.backend.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TareaRepository extends JpaRepository<Tarea, Long> {

    // A. LISTADO COMPLETO (Para que el Front gestione filtros o el Alumno vea su historial)
    // El "OrderBy" asegura que lo último que se le asignó salga arriba.
    List<Tarea> findByAlumno_IdOrderByFechaAsignacionDesc(String idAlumno);

    // B. BÚSQUEDA POR ESTADO (Lo que pediste: buscar por cualquier estado)
    // Útil para: "Ver solo mis tareas CANCELADAS" o "Ver solo las EN_PROGRESO"
    List<Tarea> findByAlumno_IdAndEstado(String idAlumno, String estado);

    // C. BÚSQUEDA PARA EL TUTOR DE EMPRESA
    // Para que el tutor vea qué alumnos tienen tareas 'REASIGNADAS' o 'COMPLETADAS'
    List<Tarea> findByTutorEmpresa_IdAndEstado(String codigoTutor, String estado);

    // D. BÚSQUEDA PARA EL PROFESOR-TUTOR
    // Solo le interesan las que el alumno marcó como 'COMPLETADA' para ponerlas como 'REVISADA'
    List<Tarea> findByProfesorTutor_IdAndEstado(String idProfesor, String estado);
}
