package com.dam.proyecto.backend.service.users;

import com.dam.proyecto.backend.model.users.Profesor;
import com.dam.proyecto.backend.model.enums.RolDocente;
import java.util.List;
import java.util.Optional;

public interface IProfesorService {
    List<Profesor> listarTodos();
    Optional<Profesor> obtenerPorId(String id);
    Profesor guardar(Profesor profesor);
    void eliminar(String id);
    List<Profesor> listarPorRol(RolDocente rol);
}
