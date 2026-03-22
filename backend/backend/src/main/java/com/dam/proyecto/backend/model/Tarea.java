package com.dam.proyecto.backend.model;

import com.dam.proyecto.backend.model.users.Alumno;
import com.dam.proyecto.backend.model.users.Profesor;
import com.dam.proyecto.backend.model.users.TutorEmpresa;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "tareas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tarea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTarea;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "fecha_asignacion", nullable = false)
    private LocalDate fechaAsignacion = LocalDate.now();

    @Column(name = "fecha_limite")
    private LocalDate fechaLimite;

    @Column(length = 20)
    private String estado = "ASIGNADA"; // ASIGNADA, COMPLETADA, VALIDADA

    @Column(name = "horas_estimadas_ia", columnDefinition = "DECIMAL(5,2)")
    private Double horasEstimadasIA; // Predicción de la Regresión (ML)

    @Column(name = "horas_reales", columnDefinition = "DECIMAL(5,2)")
    private Double horasReales = 0.0; // Introducido por el Alumno al completar

    // 1. El que CREA y ASIGNA (Tutor de Empresa)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fk_tutor_empresa", referencedColumnName = "codigo_tutor", nullable = false)
    @JsonIgnoreProperties({"alumnos", "empresa", "tareas"})
    private TutorEmpresa tutorEmpresa;

    // 2. El que RECIBE y REALIZA (Alumno)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fk_alumno", referencedColumnName = "id_codigo_alumno", nullable = false)
    @JsonIgnoreProperties({"asistencias", "tareas", "centro", "empresa", "profesor", "tutor"})
    private Alumno alumno;

    // 3. El que REVISA y VALIDA (Profesor - Rol Tutor)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fk_profesor_tutor", referencedColumnName = "codigo_docente")
    @JsonIgnoreProperties({"alumnos", "centro", "tareas"})
    private Profesor profesorTutor;
}