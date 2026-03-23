package com.dam.proyecto.backend.repository;

import com.dam.proyecto.backend.model.CentroDocente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CentroDocenteRepository extends JpaRepository<CentroDocente, String> {

    // 1. EL "VER DETALLE" (Búsqueda por PK en Java: codCentro)
    Optional<CentroDocente> findByCodCentro(String codCentro);

    // 2. VALIDACIÓN / RECUPERACIÓN POR EMAIL
    Optional<CentroDocente> findByCorreoInstitucional(String correoInstitucional);

    // 3. EL CENTRO DE UN ALUMNO (SQL Nativo para evitar líos de nombres de atributos)
    // Usamos los nombres de las columnas reales de tu SQL: fk_centro e id_codigo_alumno
    @Query(value = "SELECT c.* FROM centros c " +
            "JOIN alumnos a ON a.fk_centro = c.codigo_centro " +
            "WHERE a.id_codigo_alumno = :idAlumno", nativeQuery = true)
    Optional<CentroDocente> findCentroByAlumnoId(@Param("idAlumno") String idAlumno);
}
