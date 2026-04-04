package com.dam.proyecto.backend.dto.centro;

import com.dam.proyecto.backend.model.CentroDocente;
import org.springframework.stereotype.Component;

@Component
public class CentroDocenteMapper {

    // Convierte la entidad CentroDocente a CentroDocenteDTO
    public CentroDocenteDTO convertirACentroDocenteDTO(CentroDocente centroDocente) {
        if (centroDocente == null) {
            return null;
        }

        return new CentroDocenteDTO(
                centroDocente.getCodCentro(),
                centroDocente.getNombre(),
                centroDocente.getDireccion(),
                centroDocente.getLocalidad(),
                centroDocente.getTelefono(),
                centroDocente.getCorreoInstitucional()
        );
    }

    // Convierte un CentroDocenteDTO a la entidad CentroDocente
    public CentroDocente convertirACentroDocente(CentroDocenteDTO centroDocenteDTO) {
        if (centroDocenteDTO == null) {
            return null;
        }

        CentroDocente centroDocente = new CentroDocente();
        centroDocente.setCodCentro(centroDocenteDTO.getCodCentro());
        centroDocente.setNombre(centroDocenteDTO.getNombre());
        centroDocente.setDireccion(centroDocenteDTO.getDireccion());
        centroDocente.setLocalidad(centroDocenteDTO.getLocalidad());
        centroDocente.setTelefono(centroDocenteDTO.getTelefono());
        centroDocente.setCorreoInstitucional(centroDocenteDTO.getCorreoInstitucional());

        return centroDocente;
    }
}
