package com.dam.proyecto.backend.repository;

import com.dam.proyecto.backend.model.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {

    // Para buscar si el alumno ya ha fichado hoy (útil para el UPDATE de la salida)
    @Query("SELECT a FROM Asistencia a WHERE a.alumno.id = :idAlumno AND a.fecha = :fecha")
    Optional<Asistencia> findByAlumno_IdAndFecha(
            @Param("idAlumno") String idAlumno,
            @Param("fecha") LocalDate fecha
    );

    // Para sacar el histórico de fichajes de un alumno concreto
    @Query("SELECT a FROM Asistencia a WHERE a.alumno.id = :idAlumno ORDER BY a.fecha DESC")
    List<Asistencia> findByAlumno_IdOrderByFechaDesc(@Param("idAlumno") String idAlumno);
}
