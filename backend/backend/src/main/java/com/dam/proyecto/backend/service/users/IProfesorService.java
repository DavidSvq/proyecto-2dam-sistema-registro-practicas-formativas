package com.dam.proyecto.backend.service.users;

import com.dam.proyecto.backend.model.users.Profesor;
import com.dam.proyecto.backend.model.enums.RolDocente;
import java.util.List;
import java.util.Optional;

public interface IProfesorService {

    // 1. ACCIONES DE GESTIÓN (Lo que el Gestor hace para crear el equipo)
    // El Gestor crea el email y la password inicial del nuevo profesor
    Profesor guardar(Profesor profesor);

    // El Gestor (o el propio profesor) actualiza sus datos
    Profesor actualizar(String idProfesor, Profesor profesor);

    void eliminarProfesor(String codigoDocente);

    // 2. MÉTODOS DE BÚSQUEDA (Basados en nuestro Repository)

    // LOGIN: Para que el sistema verifique las credenciales al entrar
    Optional<Profesor> buscarPorEmail(String email);

    // PERFIL: Para ver el detalle de un profesor concreto (por su ID/Código)
    Optional<Profesor> obtenerPorId(String idProfesor);

    // VISTA DE EQUIPO: El Gestor ve a todos los profesores de su centro
    List<Profesor> listarPorCentro(String codCentro);

    // ASIGNACIÓN: El Gestor busca solo a los TUTORES para asignarles alumnos
    List<Profesor> listarTutoresPorCentro(String codCentro, RolDocente rol);

    // VISTA DEL ALUMNO: Para que el alumno sepa quién es su tutor docente
    Optional<Profesor> obtenerProfesorDeAlumno(String idAlumno);


    // 3. LÓGICA DE CARGA DOCENTE
    // Método para sumar/restar al contador 'numAlumnos' automáticamente
    void actualizarContadorAlumnos(String idProfesor, int incremento);
}
