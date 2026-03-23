package com.dam.proyecto.backend.service;

import com.dam.proyecto.backend.model.CentroDocente;
import java.util.Optional;

public interface ICentroDocenteService {

    // 1. GESTIÓN INSTITUCIONAL
    // Para que el gestor pueda editar los datos de contacto del IES
    CentroDocente guardar(CentroDocente centro);
    CentroDocente actualizar(String codCentro, CentroDocente centro);
    void eliminar(String codigoCentro);

    // 2. EL "VER DETALLE" (Búsqueda por PK)
    Optional<CentroDocente> obtenerPorCodigo(String codCentro);

    // 3. ACCESO RÁPIDO (CENTRO ÚNICO)
    // Devuelve el primer centro de la tabla (ideal si solo hay uno)
    Optional<CentroDocente> obtenerCentroPrincipal();

    // 4. VALIDACIÓN SEGURIDAD
    Optional<CentroDocente> buscarPorCorreo(String correo);

    // 5. VÍNCULO CON ALUMNO
    // Para saber de qué instituto viene un alumno concreto
    Optional<CentroDocente> obtenerCentroDeAlumno(String idAlumno);
}
