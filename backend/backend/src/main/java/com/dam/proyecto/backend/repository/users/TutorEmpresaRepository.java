package com.dam.proyecto.backend.repository.users;

import com.dam.proyecto.backend.model.users.TutorEmpresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TutorEmpresaRepository extends JpaRepository<TutorEmpresa, String> {
    // Ejemplo: Buscar todos los tutores que pertenecen a una empresa específica por su CIF
    List<TutorEmpresa> findByEmpresaCif(String cif);
}
