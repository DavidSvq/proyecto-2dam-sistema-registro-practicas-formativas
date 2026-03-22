package com.dam.proyecto.backend.service.impl;

import com.dam.proyecto.backend.model.Empresa;
import com.dam.proyecto.backend.repository.EmpresaRepository;
import com.dam.proyecto.backend.service.IEmpresaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class EmpresaServiceImpl implements IEmpresaService {

    private final EmpresaRepository empresaRepository;

    public EmpresaServiceImpl(EmpresaRepository empresaRepository) {
        this.empresaRepository = empresaRepository;
    }

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

    // 2. OBTENER POR CIF (EL DETALLE)
    @Override
    @Transactional(readOnly = true)
    public Optional<Empresa> obtenerPorCif(String cif) {
        return empresaRepository.findByCif(cif);
    }

    // 3. BUSCADOR POR NOMBRE
    @Override
    @Transactional(readOnly = true)
    public List<Empresa> buscarPorNombre(String nombre) {
        return empresaRepository.findByRazonSocialContainingIgnoreCase(nombre);
    }

    // 4. LISTAR POR CENTRO (USANDO LA NATIVE QUERY)
    @Override
    @Transactional(readOnly = true)
    public List<Empresa> listarEmpresasPorCentro(String codigoCentro) {
        return empresaRepository.findEmpresasByCodigoCentro(codigoCentro);
    }

    // 5. OBTENER LA EMPRESA DE UN ALUMNO (USANDO LA NATIVE QUERY)
    @Override
    @Transactional(readOnly = true)
    public Optional<Empresa> obtenerEmpresaDeAlumno(String idAlumno) {
        return empresaRepository.findByAlumnoId(idAlumno);
    }
}
