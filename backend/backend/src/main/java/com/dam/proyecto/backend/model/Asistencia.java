package com.dam.proyecto.backend.model;

import com.dam.proyecto.backend.model.users.Alumno;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "asistencias")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Asistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAsistencia;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "hora_entrada", nullable = false)
    private LocalTime horaEntrada;

    @Column(name = "hora_salida")
    private LocalTime horaSalida;

    @Column(name = "horas_diarias")
    private Double horasDiarias = 0.0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_alumno", referencedColumnName = "id_codigo_alumno", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "centro", "empresa", "profesor", "tutorEmpresa"})
    private Alumno alumno;

    @Column(columnDefinition = "TEXT")
    private String observaciones;
}