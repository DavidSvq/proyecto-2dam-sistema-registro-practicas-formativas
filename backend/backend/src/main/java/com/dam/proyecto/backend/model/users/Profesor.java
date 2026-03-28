package com.dam.proyecto.backend.model.users;

import com.dam.proyecto.backend.model.CentroDocente;
import com.dam.proyecto.backend.model.enums.RolUsuario;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "personal_docente")
@AttributeOverride(name = "id", column = @Column(name = "codigo_docente", length = 20))
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Profesor extends Usuario {

   /* @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RolDocente rol;*/

    @Column(name = "num_alumnos")
    private Integer numAlumnos = 0;

    // Relación con el Centro que ya tienes creado
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_centro", referencedColumnName = "codigo_centro")
    private CentroDocente centro;

    @Override
    public void login(String email, String password, RolUsuario rol) {
        // Lógica de autenticación
    }

    @Override
    public void recuperarPassword(String email, String nuevaPassword) {
        // Lógica de recuperación
    }
}
