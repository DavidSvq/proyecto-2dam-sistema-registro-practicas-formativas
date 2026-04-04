package com.dam.proyecto.backend.dto.empresa;

import com.dam.proyecto.backend.model.Empresa;
import org.springframework.stereotype.Component;

@Component
public class EmpresaMapper {

    // Convierte la entidad Empresa a EmpresaDTO
    public EmpresaDTO convertirAEmpresaDTO(Empresa empresa) {
        if (empresa == null) {
            return null;
        }

        EmpresaDTO empresaDTO = new EmpresaDTO();

        empresaDTO.setCif(empresa.getCif());
        empresaDTO.setRazonSocial(empresa.getRazonSocial());
        empresaDTO.setDireccion(empresa.getDireccion());
        empresaDTO.setLocalidad(empresa.getLocalidad());
        empresaDTO.setTelefonoContacto(empresa.getTelefonoContacto());
        empresaDTO.setEmailContacto(empresa.getEmailContacto());
        empresaDTO.setPersonaContacto(empresa.getPersonaContacto());

        return empresaDTO;
    }

    // Convierte un EmpresaDTO a una entidad Empresa
    public Empresa convertirAEmpresa(EmpresaDTO empresaDTO) {
        if (empresaDTO == null) {
            return null;
        }

        Empresa empresa = new Empresa();

        empresa.setCif(empresaDTO.getCif());
        empresa.setRazonSocial(empresaDTO.getRazonSocial());
        empresa.setDireccion(empresaDTO.getDireccion());
        empresa.setLocalidad(empresaDTO.getLocalidad());
        empresa.setTelefonoContacto(empresaDTO.getTelefonoContacto());
        empresa.setEmailContacto(empresaDTO.getEmailContacto());
        empresa.setPersonaContacto(empresaDTO.getPersonaContacto());

        return empresa;
    }
}