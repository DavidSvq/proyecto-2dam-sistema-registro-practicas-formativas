package com.dam.proyecto.backend.service;

import com.dam.proyecto.backend.model.Asistencia;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface IAsistenciaService {

    /**
     * Registra el inicio de la jornada laboral de un alumno.
     * @param idAlumno El código único (VARCHAR) del alumno.
     * @return El objeto Asistencia creado con la hora de entrada actual.
     */
    Asistencia registrarEntrada(String idAlumno, LocalTime horaManual);

    /**
     * Registra el fin de la jornada, calcula las horas y actualiza el total del alumno.
     * @param idAlumno El código único del alumno.
     * @param observaciones Comentarios sobre las tareas realizadas (opcional).
     * @return El objeto Asistencia actualizado con hora de salida y horas totales diarias.
     */
    Asistencia registrarSalida(String idAlumno, String observaciones, LocalTime horaManual);

    /**
     * Obtiene todos los registros de asistencia de un alumno específico.
     * @param idAlumno El código único del alumno.
     * @return Lista de asistencias ordenadas cronológicamente.
     */
    List<Asistencia> listarAsistenciasPorAlumno(String idAlumno);

    /**
     * Busca si existe un fichaje activo para el día de hoy.
     * Útil para que el Front-end sepa si mostrar el botón de "Entrada" o "Salida".
     * @param idAlumno El código del alumno.
     * @param fecha La fecha a consultar (normalmente hoy).
     * @return La asistencia si existe, o null/empty si no ha fichado.
     */
    Asistencia buscarAsistenciaPorFecha(String idAlumno, LocalDate fecha);
}