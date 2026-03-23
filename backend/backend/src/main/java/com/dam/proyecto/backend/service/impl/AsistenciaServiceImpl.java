package com.dam.proyecto.backend.service.impl;

import com.dam.proyecto.backend.model.Asistencia;
import com.dam.proyecto.backend.model.users.Alumno;
import com.dam.proyecto.backend.repository.AsistenciaRepository;
import com.dam.proyecto.backend.repository.users.AlumnoRepository;
import com.dam.proyecto.backend.service.IAsistenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class AsistenciaServiceImpl implements IAsistenciaService {

    @Autowired
    private AsistenciaRepository asistenciaRepository;

    @Autowired
    private AlumnoRepository alumnoRepository; // Necesario para actualizar el contador del alumno

    @Override
    @Transactional
    public Asistencia registrarEntrada(String idAlumno, LocalTime horaManual) {
        // 1. Verificar si el alumno existe
        Alumno alumno = alumnoRepository.findById(idAlumno)
                .orElseThrow(() -> new RuntimeException("Alumno con ID " + idAlumno + " no encontrado"));

        // 2. Comprobar si ya ha fichado hoy para no duplicar entrada
        asistenciaRepository.findByAlumno_IdAndFecha(idAlumno, LocalDate.now())
                .ifPresent(a -> { throw new RuntimeException("El alumno ya ha registrado su entrada hoy"); });

        // 3. Crear el nuevo registro
        Asistencia asistencia = new Asistencia();
        asistencia.setAlumno(alumno);
        asistencia.setFecha(LocalDate.now());
        asistencia.setHoraEntrada(horaManual != null ? horaManual : LocalTime.now());

        return asistenciaRepository.save(asistencia);
    }

    @Override
    @Transactional
    public Asistencia registrarSalida(String idAlumno, String observaciones, LocalTime horaManual) {
        // 1. Recuperar el registro de entrada de hoy
        Asistencia asistencia = asistenciaRepository.findByAlumno_IdAndFecha(idAlumno, LocalDate.now())
                .orElseThrow(() -> new RuntimeException("No se encontró un registro de entrada para hoy"));

        // 2. Evitar doble fichaje de salida
        if (asistencia.getHoraSalida() != null) {
            throw new RuntimeException("Ya se ha registrado la salida para el día de hoy");
        }

        // 3. Registrar salida y observaciones
        asistencia.setHoraSalida(horaManual != null ? horaManual : LocalTime.now());
        asistencia.setObservaciones(observaciones != null ? observaciones : "Sin observaciones");

        // 4. Lógica de cálculo de tiempo (en formato decimal para precisión)
        Duration duracion = Duration.between(asistencia.getHoraEntrada(), asistencia.getHoraSalida());
        double minutosTotales = duracion.toMinutes();
        double horasDelDia = minutosTotales / 60.0;
        asistencia.setHorasDiarias(horasDelDia);

        // 5. Actualizar las horas totales en la ficha del alumno (Conversión a INT)
        Alumno alumno = asistencia.getAlumno();
        int horasAcumuladas = alumno.getHorasTotales() + (int) Math.round(horasDelDia);
        alumno.setHorasTotales(horasAcumuladas);

        // 6. Guardar cambios (al ser Transactional, se actualizan ambas tablas)
        alumnoRepository.save(alumno);
        return asistenciaRepository.save(asistencia);
    }

    @Override
    public List<Asistencia> listarAsistenciasPorAlumno(String idAlumno) {
        return asistenciaRepository.findByAlumno_IdOrderByFechaDesc(idAlumno);
    }

    @Override
    public Asistencia buscarAsistenciaPorFecha(String idAlumno, LocalDate fecha) {
        return asistenciaRepository.findByAlumno_IdAndFecha(idAlumno, fecha)
                .orElse(null);
    }
}
