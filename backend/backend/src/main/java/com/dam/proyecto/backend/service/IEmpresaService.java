package com.dam.proyecto.backend.service;

import com.dam.proyecto.backend.dto.empresa.EmpresaDTO;
import com.dam.proyecto.backend.model.Empresa;

import java.util.List;
import java.util.Optional;

public interface IEmpresaService {

    // 1. OPERACIONES BÁSICAS (CRUD OPERATIVO)
    // Para dar de alta nuevas empresas o actualizar datos de contacto
    Empresa guardar(Empresa empresa);
    Empresa actualizar(String cif, Empresa empresa);
    void eliminar(String cif);

    // 2. EL "VER DETALLE"
    // Buscamos por el CIF que es la PK real
    Optional<EmpresaDTO> obtenerPorCif(String cif);

    // 3. EL BUSCADOR DE LA INTERFAZ
    // Para filtrar por nombre en el front-end
    List<EmpresaDTO> buscarPorNombre(String nombre);

    // 4. FILTRO POR CENTRO (Lógica de Gestor)
    // Para que cada instituto vea solo sus empresas colaboradoras
    List<EmpresaDTO> listarEmpresasPorCentro(String codigoCentro);

    // 5. VÍNCULO CON ALUMNO
    // Para obtener los datos de la empresa donde el alumno hace prácticas
    Optional<EmpresaDTO> obtenerEmpresaDeAlumno(String idAlumno);
}
