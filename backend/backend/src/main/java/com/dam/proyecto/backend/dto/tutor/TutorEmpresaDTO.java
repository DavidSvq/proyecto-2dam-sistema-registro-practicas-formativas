package com.dam.proyecto.backend.dto.tutor;

import com.dam.proyecto.backend.dto.empresa.EmpresaDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.dam.proyecto.backend.model.enums.RolUsuario;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TutorEmpresaDTO {

    private String id; // ID de Usuario (codigo_tutor)
    private String nombre;
    private String apellidos;
    private String email;
    private String password; // Aunque generalmente no pasamos la contraseña, la dejo para mantener la coherencia.
    private RolUsuario rol;
    private Integer numAlumnos;
    private EmpresaDTO empresa;

}
