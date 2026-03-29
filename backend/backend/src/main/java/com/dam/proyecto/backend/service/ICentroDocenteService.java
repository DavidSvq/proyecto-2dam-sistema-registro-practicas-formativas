package com.dam.proyecto.backend.service;

import com.dam.proyecto.backend.dto.centro.CentroDocenteDTO;
import com.dam.proyecto.backend.model.CentroDocente;
import java.util.Optional;

public interface ICentroDocenteService {

    // 1. GESTIÓN INSTITUCIONAL
    // Para que el gestor pueda editar los datos de contacto del IES
    CentroDocente guardar(CentroDocente centro);
    CentroDocente actualizar(String codCentro, CentroDocente centro);
    void eliminar(String codigoCentro);

    // 2. EL "VER DETALLE" (Búsqueda por PK)
    Optional<CentroDocenteDTO> obtenerPorCodigo(String codCentro);

    // 3. ACCESO RÁPIDO (CENTRO ÚNICO)
    // Devuelve el primer centro de la tabla (ideal si solo hay uno)
    Optional<CentroDocenteDTO> obtenerCentroPrincipal();

    // 4. VALIDACIÓN SEGURIDAD
    Optional<CentroDocenteDTO> buscarPorCorreo(String correo);

    // 5. VÍNCULO CON ALUMNO
    // Para saber de qué instituto viene un alumno concreto
    Optional<CentroDocenteDTO> obtenerCentroDeAlumno(String idAlumno);
}
