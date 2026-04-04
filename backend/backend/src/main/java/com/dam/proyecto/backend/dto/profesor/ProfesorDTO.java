package com.dam.proyecto.backend.dto.profesor;

import com.dam.proyecto.backend.dto.centro.CentroDocenteDTO;
import com.dam.proyecto.backend.model.enums.RolUsuario;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfesorDTO {

    private String id;
    private String nombre;
    private String apellidos;
    private String email;
    private String password;
    private RolUsuario rol;
    private Integer numAlumnos;
    private CentroDocenteDTO centro;

}