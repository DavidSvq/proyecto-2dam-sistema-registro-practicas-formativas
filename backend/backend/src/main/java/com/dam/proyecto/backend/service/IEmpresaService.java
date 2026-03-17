package com.dam.proyecto.backend.service;

import com.dam.proyecto.backend.model.Empresa;

import java.util.List;
import java.util.Optional;

public interface IEmpresaService {
    List<Empresa> listarTodas();
    Optional<Empresa> buscarPorCif(String cif);
    Empresa guardar(Empresa empresa);
    Empresa actualizar(String cif, Empresa empresa);
    void eliminar(String cif);
}
