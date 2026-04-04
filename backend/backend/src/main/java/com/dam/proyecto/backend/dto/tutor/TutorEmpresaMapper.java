package com.dam.proyecto.backend.dto.tutor;

import com.dam.proyecto.backend.dto.empresa.EmpresaMapper;
import com.dam.proyecto.backend.model.users.TutorEmpresa;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Component
public class TutorEmpresaMapper {

    private final EmpresaMapper empresaMapper;

    // Convierte la entidad TutorEmpresa a TutorEmpresaDTO
    public TutorEmpresaDTO convertirATutorEmpresaDTO(TutorEmpresa tutorEmpresa) {
        if (tutorEmpresa == null) {
            return null;
        }

        return new TutorEmpresaDTO(
                tutorEmpresa.getId(), // ID del tutor (codigo_tutor)
                tutorEmpresa.getNombre(),
                tutorEmpresa.getApellidos(),
                tutorEmpresa.getEmail(),
                tutorEmpresa.getPassword(), // Si prefieres omitir la contraseña, simplemente elimina este campo.
                tutorEmpresa.getRol(),
                tutorEmpresa.getNumAlumnos(),
                empresaMapper.convertirAEmpresaDTO(tutorEmpresa.getEmpresa()) // Relación con Empresa
        );
    }

    // Convierte el TutorEmpresaDTO a la entidad TutorEmpresa
    public TutorEmpresa convertirATutorEmpresa(TutorEmpresaDTO tutorEmpresaDTO) {
        if (tutorEmpresaDTO == null) {
            return null;
        }

        TutorEmpresa tutorEmpresa = new TutorEmpresa();
        tutorEmpresa.setId(tutorEmpresaDTO.getId());
        tutorEmpresa.setNombre(tutorEmpresaDTO.getNombre());
        tutorEmpresa.setApellidos(tutorEmpresaDTO.getApellidos());
        tutorEmpresa.setEmail(tutorEmpresaDTO.getEmail());
        tutorEmpresa.setPassword(tutorEmpresaDTO.getPassword()); // Si no deseas incluir la contraseña, la eliminas de aquí también.
        tutorEmpresa.setRol(tutorEmpresaDTO.getRol());
        tutorEmpresa.setNumAlumnos(tutorEmpresaDTO.getNumAlumnos());
        tutorEmpresa.setEmpresa(empresaMapper.convertirAEmpresa(tutorEmpresaDTO.getEmpresa())); // Relación con Empresa

        return tutorEmpresa;
    }
}
