package com.dam.proyecto.backend.repository.users;

import com.dam.proyecto.backend.model.users.Profesor;
import com.dam.proyecto.backend.model.enums.RolDocente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProfesorRepository extends JpaRepository<Profesor, String> {
    // Ejemplo de búsqueda por rol (Gestor o Tutor)
    List<Profesor> findByRol(RolDocente rol);
}
