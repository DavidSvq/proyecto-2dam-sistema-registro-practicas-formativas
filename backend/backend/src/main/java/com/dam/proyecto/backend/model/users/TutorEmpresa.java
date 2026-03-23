package com.dam.proyecto.backend.model.users;

import com.dam.proyecto.backend.model.Empresa;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tutores_empresa")
@AttributeOverride(name = "id", column = @Column(name = "codigo_tutor", length = 20))
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class TutorEmpresa extends Usuario {

    // El ID de Usuario mapeará a 'codigo_tutor' de tu SQL

    @Column(name = "num_alumnos")
    private Integer numAlumnos = 0;

    // Relación unidireccional con Empresa
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_empresa", referencedColumnName = "cif")
    private Empresa empresa;

    @Override
    public void login(String email, String password) {
        // Lógica de acceso para tutores de empresa
    }

    @Override
    public void recuperarPassword(String email) {
        // Lógica de recuperación
    }
}
