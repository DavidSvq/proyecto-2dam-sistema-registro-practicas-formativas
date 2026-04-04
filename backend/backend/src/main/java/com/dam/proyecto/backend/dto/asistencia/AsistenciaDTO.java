package com.dam.proyecto.backend.dto.asistencia;

import com.dam.proyecto.backend.dto.alumno.AlumnoDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AsistenciaDTO {

    private Long idAsistencia;
    private LocalDate fecha;
    private LocalTime horaEntrada;
    private LocalTime horaSalida;
    private Double horasDiarias;
    private AlumnoDTO alumno;
    private String observaciones;

}