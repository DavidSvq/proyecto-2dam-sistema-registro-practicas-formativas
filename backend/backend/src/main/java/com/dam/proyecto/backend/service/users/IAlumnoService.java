package com.dam.proyecto.backend.service.users;

import com.dam.proyecto.backend.model.users.Alumno;
import java.util.List;
import java.util.Optional;

public interface IAlumnoService {
    List<Alumno> listarTodos();
    Optional<Alumno> obtenerPorId(String id);
    Alumno guardar(Alumno alumno);
    void eliminar(String id);
    List<Alumno> listarPorProfesor(String profesorId);
}