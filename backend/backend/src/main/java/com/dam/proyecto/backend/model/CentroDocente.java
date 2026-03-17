package com.dam.proyecto.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "centros")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CentroDocente {

    @Id
    @Column(name = "codigo_centro", length = 20)
    private String codCentro;

    @Column(name = "nombre_oficial",nullable = false, length = 150)
    private String nombre;

    @Column(name = "direccion")
    private String direccion;

    @Column(name = "localidad", length = 100)
    private String localidad;

    @Column(name = "telefono", length = 20)
    private String telefono;

    @Column(name = "correo_institucional", unique = true, length = 100)
    private String correoInstitucional;
}
