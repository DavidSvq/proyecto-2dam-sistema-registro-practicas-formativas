package com.dam.proyecto.backend.dto.tarea;

import com.dam.proyecto.backend.dto.alumno.AlumnoDTO;
import com.dam.proyecto.backend.dto.profesor.ProfesorDTO;
import com.dam.proyecto.backend.dto.tutor.TutorEmpresaDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TareaDTO {

    private Long idTarea;  // Identificador único de la tarea

    private String titulo;  // Título de la tarea

    private String descripcion;  // Descripción detallada de la tarea

    private LocalDate fechaAsignacion;  // Fecha de asignación de la tarea

    private LocalDate fechaLimite;  // Fecha límite de entrega de la tarea

    private String estado;  // Estado de la tarea: ASIGNADA, COMPLETADA, VALIDADA

    private Double horasEstimadasIA;  // Horas estimadas por IA para completar la tarea

    private Double horasReales;  // Horas reales introducidas por el alumno al completar la tarea

    private AlumnoDTO alumno;  // Información del alumno que recibe y realiza la tarea

    private TutorEmpresaDTO tutorEmpresa;  // Información del tutor de empresa que asigna la tarea

    private ProfesorDTO profesorTutor;  // Información del profesor tutor que valida la tarea
}
