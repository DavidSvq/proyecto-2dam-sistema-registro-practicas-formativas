package com.dam.proyecto.backend.service.users;

import com.dam.proyecto.backend.model.users.Alumno;
import com.dam.proyecto.backend.model.users.TutorEmpresa;
import java.util.List;

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
    List<TutorEmpresa> listarPorEmpresa(String cifEmpresa);


    // --- ACCIONES DEL TUTOR DE EMPRESA ---

    /**
     * Devuelve la lista de alumnos que el tutor tiene bajo su supervisión.
     */
    List<Alumno> listarMisAlumnos(String idTutor);

    /**
     * Recupera la información del perfil del propio tutor.
     */
    TutorEmpresa obtenerPerfil(String idTutor);
}
