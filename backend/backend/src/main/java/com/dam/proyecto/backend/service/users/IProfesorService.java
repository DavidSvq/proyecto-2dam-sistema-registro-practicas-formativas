package com.dam.proyecto.backend.service.users;

import com.dam.proyecto.backend.dto.login.LoginResponseDTO;
import com.dam.proyecto.backend.dto.profesor.ProfesorDTO;
import com.dam.proyecto.backend.model.enums.RolUsuario;
import com.dam.proyecto.backend.model.users.Profesor;

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

    // --- Login ---
    LoginResponseDTO login(String email, String password, RolUsuario rol);

    void recuperarPassword(String email, String nuevaPassword);

    // PERFIL: Para ver el detalle de un profesor concreto (por su ID/Código)
    Optional<ProfesorDTO> obtenerProfesorPorId(String idProfesor);

    // VISTA DE EQUIPO: El Gestor ve a todos los profesores de su centro
    List<ProfesorDTO> listarPorCentro(String codCentro);

    // ASIGNACIÓN: El Gestor busca solo a los TUTORES para asignarles alumnos
    List<ProfesorDTO> listarTutoresPorCentro(String codCentro, RolUsuario rol);

    // VISTA DEL ALUMNO: Para que el alumno sepa quién es su tutor docente
    Optional<ProfesorDTO> obtenerProfesorDeAlumno(String idAlumno);


    // 3. LÓGICA DE CARGA DOCENTE
    // Método para sumar/restar al contador 'numAlumnos' automáticamente
    void actualizarContadorAlumnos(String idProfesor, int incremento);
}
