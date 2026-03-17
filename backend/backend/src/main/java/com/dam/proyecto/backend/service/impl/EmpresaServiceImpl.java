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

    // Inyección por constructor (la forma recomendada en Spring)
    public EmpresaServiceImpl(EmpresaRepository empresaRepository) {
        this.empresaRepository = empresaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Empresa> listarTodas() {
        return empresaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Empresa> buscarPorCif(String cif) {
        return empresaRepository.findById(cif);
    }

    @Override
    @Transactional
    public Empresa guardar(Empresa empresa) {
        return empresaRepository.save(empresa);
    }

    @Override
    @Transactional
    public Empresa actualizar(String cif, Empresa empresaActualizada) {
        return empresaRepository.findById(cif)
                .map(empresa -> {
                    // Actualizamos campo a campo para mayor seguridad
                    empresa.setRazonSocial(empresaActualizada.getRazonSocial());
                    empresa.setDireccion(empresaActualizada.getDireccion());
                    empresa.setLocalidad(empresaActualizada.getLocalidad());
                    empresa.setTelefonoContacto(empresaActualizada.getTelefonoContacto());
                    empresa.setEmailContacto(empresaActualizada.getEmailContacto());
                    empresa.setPersonaContacto(empresaActualizada.getPersonaContacto());
                    return empresaRepository.save(empresa);
                })
                .orElseThrow(() -> new RuntimeException("No se encontró la empresa con CIF: " + cif));
    }

    @Override
    @Transactional
    public void eliminar(String cif) {
        empresaRepository.deleteById(cif);
    }
}
