package com.dam.proyecto.backend.repository;

import com.dam.proyecto.backend.model.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, String> {

    // 1. Detalle por CIF
    Optional<Empresa> findByCif(String cif);

    // 2. Buscador por nombre
    List<Empresa> findByRazonSocialContainingIgnoreCase(String razonSocial);

    // 3. Empresas por Centro
    // Como Centro hereda de Usuario (o su @Id es 'id'), usamos 'id'
    @Query(value = "SELECT DISTINCT e.* FROM empresas e " +
            "JOIN alumnos a ON a.fk_empresa = e.cif " +
            "WHERE a.fk_centro = :codigoCentro", nativeQuery = true)
    List<Empresa> findEmpresasByCodigoCentro(@Param("codigoCentro") String codigoCentro);

    // 4. Empresa de un Alumno
    // Como Alumno hereda de Usuario, su campo en Java es 'id'
    @Query("SELECT a.empresa FROM Alumno a WHERE a.id = :idAlumno")
    Optional<Empresa> findByAlumnoId(@Param("idAlumno") String idAlumno);
}
