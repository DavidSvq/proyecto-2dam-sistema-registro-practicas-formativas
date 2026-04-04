package com.dam.proyecto.backend.dto.empresa;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmpresaDTO {
    private String cif;
    private String razonSocial;
    private String direccion;
    private String localidad;
    private String telefonoContacto;
    private String emailContacto;
    private String personaContacto;

}
