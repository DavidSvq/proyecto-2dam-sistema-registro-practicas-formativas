package com.dam.proyecto.backend.dto.centro;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CentroDocenteDTO {

    private String codCentro;
    private String nombre;
    private String direccion;
    private String localidad;
    private String telefono;
    private String correoInstitucional;

}
