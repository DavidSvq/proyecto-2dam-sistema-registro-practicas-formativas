package com.dam.proyecto.backend.controller;

import com.dam.proyecto.backend.model.Asistencia;
import com.dam.proyecto.backend.service.IAsistenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/asistencias")
public class AsistenciaController {

    @Autowired
    private IAsistenciaService asistenciaService;

    // 1. Marcar Entrada
    // POST http://localhost:8088/api/asistencias/entrada/ALU01
    @PostMapping("/entrada/{idAlumno}")
    public ResponseEntity<?> entrada(@PathVariable String idAlumno,
                                     @RequestParam(required = false) String hora) {
        LocalTime horaEntrada = (hora != null) ? LocalTime.parse(hora) : null;
        return ResponseEntity.ok(asistenciaService.registrarEntrada(idAlumno, horaEntrada));
    }

    // 2. Marcar Salida (Enviamos las observaciones en el cuerpo de la petición)
    // SALIDA: http://localhost:8088/api/asistencias/salida/ALU01?hora=15:00:00
    @PatchMapping("/salida/{idAlumno}")
    public ResponseEntity<?> salida(@PathVariable String idAlumno,
                                    @RequestBody String observaciones,
                                    @RequestParam(required = false) String hora) {
        LocalTime horaSalida = (hora != null) ? LocalTime.parse(hora) : null;
        return ResponseEntity.ok(asistenciaService.registrarSalida(idAlumno, observaciones, horaSalida));
    }

    // 3. Consultar asistencia de un día concreto (para el Front)
    // GET http://localhost:8088/api/asistencias/buscar?idAlumno=ALU01&fecha=2026-03-21
    @GetMapping("/buscar")
    public ResponseEntity<Asistencia> buscarPorFecha(
            @RequestParam String idAlumno,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {

        Asistencia asistencia = asistenciaService.buscarAsistenciaPorFecha(idAlumno, fecha);
        return asistencia != null ? ResponseEntity.ok(asistencia) : ResponseEntity.noContent().build();
    }

    // 4. Ver historial completo de un alumno
    // GET http://localhost:8088/api/asistencias/historial/ALU01
    @GetMapping("/historial/{idAlumno}")
    public ResponseEntity<List<Asistencia>> listarHistorial(@PathVariable String idAlumno) {
        List<Asistencia> lista = asistenciaService.listarAsistenciasPorAlumno(idAlumno);
        return ResponseEntity.ok(lista);
    }
}
