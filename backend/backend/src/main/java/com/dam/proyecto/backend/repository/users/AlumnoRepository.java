package com.dam.proyecto.backend.repository.users;

import com.dam.proyecto.backend.model.users.Alumno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlumnoRepository extends JpaRepository<Alumno, String> {
    // Buscar alumnos por el ID del profesor tutor
    List<Alumno> findByProfesorId(String profesorId);

    // Buscar alumnos por el CIF de la empresa
    List<Alumno> findByEmpresaCif(String cif);
}