package com.dam.proyecto.backend.service.impl;

import com.dam.proyecto.backend.dto.empresa.EmpresaDTO;
import com.dam.proyecto.backend.dto.empresa.EmpresaMapper;
import com.dam.proyecto.backend.model.Empresa;
import com.dam.proyecto.backend.repository.EmpresaRepository;
import com.dam.proyecto.backend.service.IEmpresaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmpresaServiceImpl implements IEmpresaService {

    private final EmpresaRepository empresaRepository;

    public EmpresaServiceImpl(EmpresaRepository empresaRepository) {
        this.empresaRepository = empresaRepository;
    }

    @Autowired
    private EmpresaMapper empresaMapper;

    // 1. GUARDAR / ACTUALIZAR
    @Override
    @Transactional
    public Empresa guardar(Empresa empresa) {
        return empresaRepository.save(empresa);
    }

    @Override
    @Transactional
    public Empresa actualizar(String cif, Empresa empresaActualizada) {
        return empresaRepository.findByCif(cif)
                .map(empresa -> {
                    empresa.setRazonSocial(empresaActualizada.getRazonSocial());
                    empresa.setDireccion(empresaActualizada.getDireccion());
                    empresa.setLocalidad(empresaActualizada.getLocalidad());
                    empresa.setTelefonoContacto(empresaActualizada.getTelefonoContacto());
                    empresa.setEmailContacto(empresaActualizada.getEmailContacto());
                    empresa.setPersonaContacto(empresaActualizada.getPersonaContacto());
                    return empresaRepository.save(empresa);
                })
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada con CIF: " + cif));
    }

    @Override
    @Transactional
    public void eliminar(String cif) {
        if (!empresaRepository.existsById(cif)) {
            throw new RuntimeException("No se puede eliminar: Empresa con CIF " + cif + " no encontrada.");
        }
        empresaRepository.deleteById(cif);
    }

    // 2. OBTENER POR CIF (EL DETALLE) - DEVUELVE EmpresaDTO
    @Override
    @Transactional(readOnly = true)
    public Optional<EmpresaDTO> obtenerPorCif(String cif) {
        Optional<Empresa> empresa = empresaRepository.findById(cif);
        return empresa.map(empresaMapper::convertirAEmpresaDTO);
    }

    // 3. BUSCADOR POR NOMBRE - DEVUELVE LISTA DE EmpresaDTO
    @Override
    @Transactional(readOnly = true)
    public List<EmpresaDTO> buscarPorNombre(String nombre) {
        List<Empresa> empresas = empresaRepository.findByRazonSocialContainingIgnoreCase(nombre);
        return empresas.stream()
                .map(empresaMapper::convertirAEmpresaDTO)
                .collect(Collectors.toList());
    }

    // 4. LISTAR POR CENTRO (USANDO LA NATIVE QUERY) - DEVUELVE LISTA DE EmpresaDTO
    @Override
    @Transactional(readOnly = true)
    public List<EmpresaDTO> listarEmpresasPorCentro(String codigoCentro) {
        List<Empresa> empresas = empresaRepository.findEmpresasByCodigoCentro(codigoCentro);
        return empresas.stream()
                .map(empresaMapper::convertirAEmpresaDTO)
                .collect(Collectors.toList());
    }

    // 5. OBTENER LA EMPRESA DE UN ALUMNO (USANDO LA NATIVE QUERY) - DEVUELVE EmpresaDTO
    @Override
    @Transactional(readOnly = true)
    public Optional<EmpresaDTO> obtenerEmpresaDeAlumno(String idAlumno) {
        Optional<Empresa> empresa = empresaRepository.findByAlumnoId(idAlumno);
        return empresa.map(empresaMapper::convertirAEmpresaDTO);
    }
}
