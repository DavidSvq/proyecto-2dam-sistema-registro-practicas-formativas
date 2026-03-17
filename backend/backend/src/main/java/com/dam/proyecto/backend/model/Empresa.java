package com.dam.proyecto.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "empresas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Empresa {

    @Id
    @Column(name = "cif", length = 15)
    private String cif;

    @Column(name = "razon_social", nullable = false, length = 150)
    private String razonSocial;

    @Column(name = "direccion", length = 255)
    private String direccion;

    @Column(name = "localidad", length = 100)
    private String localidad;

    @Column(name = "telefono_contacto", length = 20)
    private String telefonoContacto;

    @Column(name = "email_contacto", length = 100)
    private String emailContacto;

    @Column(name = "persona_contacto", length = 100)
    private String personaContacto;
}