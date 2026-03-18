package com.dam.proyecto.backend.repository;

import com.dam.proyecto.backend.model.CentroDocente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CentroDocenteRepository extends JpaRepository<CentroDocente, String> {

}
