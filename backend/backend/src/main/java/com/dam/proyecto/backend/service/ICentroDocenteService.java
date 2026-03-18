package com.dam.proyecto.backend.service;

import com.dam.proyecto.backend.model.CentroDocente;
import java.util.Optional;

public interface ICentroDocenteService {

    // Método para recuperar la ficha completa de un centro por su código
    Optional<CentroDocente> buscarPorCodigo(String codCentro);

    // Método para que el Profesor Gestor pueda editar los datos del centro
    CentroDocente guardarOActualizar(CentroDocente centro);
}
