package com.dam.proyecto.backend.model.users;

import com.dam.proyecto.backend.model.*;
import com.dam.proyecto.backend.model.enums.RolUsuario;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "alumnos")
@AttributeOverride(name = "id", column = @Column(name = "id_codigo_alumno", length = 20))
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Alumno extends Usuario {

    // El ID de Usuario mapeará a 'id_codigo_alumno' de tu SQL

    @Column(name = "horas_totales")
    private Integer horasTotales = 0;

    // Relación con el Centro
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_centro", referencedColumnName = "codigo_centro")
    private CentroDocente centro;

    // Relación con la Empresa
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_empresa", referencedColumnName = "cif")
    private Empresa empresa;

    // Relación con su Profesor (Personal Docente)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_profesor", referencedColumnName = "codigo_docente")
    private Profesor profesor;

    // Relación con su Tutor de Empresa
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_tutor", referencedColumnName = "codigo_tutor")
    private TutorEmpresa tutorEmpresa;

    @Override
    public void login(String email, String password, RolUsuario rol) {
        // Lógica de acceso específica para el alumno
    }

    @Override
    public void recuperarPassword(String email, String nuevaPassword) {
        // Lógica de recuperación
    }
}
