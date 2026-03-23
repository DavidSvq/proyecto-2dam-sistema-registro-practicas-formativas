package com.dam.proyecto.backend.repository;

import com.dam.proyecto.backend.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TareaRepository extends JpaRepository<Tarea, Long> {

    // A. LISTADO POR ALUMNO (Respetando 'idAlumno')
    @Query("SELECT t FROM Tarea t WHERE t.alumno.id = :idAlumno ORDER BY t.fechaAsignacion DESC")
    List<Tarea> findByAlumno_IdOrderByFechaAsignacionDesc(@Param("idAlumno") String idAlumno);

    // B. BÚSQUEDA POR ALUMNO Y ESTADO (Respetando 'idAlumno' y 'estado')
    @Query("SELECT t FROM Tarea t WHERE t.alumno.id = :idAlumno AND t.estado = :estado")
    List<Tarea> findByAlumno_IdAndEstado(@Param("idAlumno") String idAlumno, @Param("estado") String estado);

    // C. BÚSQUEDA PARA EL TUTOR DE EMPRESA (Respetando 'codigoTutor' y 'estado')
    @Query("SELECT t FROM Tarea t WHERE t.tutorEmpresa.id = :codigoTutor AND t.estado = :estado")
    List<Tarea> findByTutorEmpresa_IdAndEstado(@Param("codigoTutor") String codigoTutor, @Param("estado") String estado);

    // D. BÚSQUEDA PARA EL PROFESOR-TUTOR (Respetando 'idProfesor' y 'estado')
    @Query("SELECT t FROM Tarea t WHERE t.profesorTutor.id = :idProfesor AND t.estado = :estado")
    List<Tarea> findByProfesorTutor_IdAndEstado(@Param("idProfesor") String idProfesor, @Param("estado") String estado);
}
