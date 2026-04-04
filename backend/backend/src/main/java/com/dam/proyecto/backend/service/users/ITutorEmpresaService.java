package com.dam.proyecto.backend.service.users;

import com.dam.proyecto.backend.dto.alumno.AlumnoDTO;
import com.dam.proyecto.backend.dto.login.LoginResponseDTO;
import com.dam.proyecto.backend.dto.tutor.TutorEmpresaDTO;
import com.dam.proyecto.backend.model.enums.RolUsuario;
import com.dam.proyecto.backend.model.users.Alumno;
import com.dam.proyecto.backend.model.users.TutorEmpresa;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ITutorEmpresaService {

    // --- ACCIONES DEL PROFESOR GESTOR ---

    /**
     * Registra un nuevo tutor vinculándolo a una empresa existente.
     */
    TutorEmpresa registrarTutorEmpresa(TutorEmpresa tutor, String cifEmpresa);

    /**
     * Actualiza los datos básicos (nombre, apellidos, email) de un tutor.
     */
    TutorEmpresa actualizarTutor(String idTutor, TutorEmpresa datosNuevos);

    /**
     * Elimina físicamente a un tutor del sistema por su ID (codigo_tutor).
     */
    void eliminarTutor(String idTutor);


    /**
     * Recupera todos los tutores que pertenecen a una misma empresa (CIF).
     */
    List<TutorEmpresaDTO> listarPorEmpresa(String cifEmpresa);

    // --- Login ---
    LoginResponseDTO login(String email, String password, RolUsuario rol);

    // --- Recuperar / cambiar contraseña ---
    void recuperarPassword(String email, String nuevaPassword);

    // --- ACCIONES DEL TUTOR DE EMPRESA ---

    /**
     * Devuelve la lista de alumnos que el tutor tiene bajo su supervisión.
     */
    List<AlumnoDTO> listarMisAlumnos(String idTutor);

    /**
     * Recupera la información del perfil del propio tutor.
     */
    TutorEmpresaDTO obtenerPerfil(String idTutor);
}
