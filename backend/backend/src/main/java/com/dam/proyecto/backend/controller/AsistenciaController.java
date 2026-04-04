package com.dam.proyecto.backend.controller;

import com.dam.proyecto.backend.dto.asistencia.AsistenciaDTO;
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
@CrossOrigin(origins = "*")
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
    public ResponseEntity<AsistenciaDTO> buscarPorFecha(
            @RequestParam String idAlumno,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {

        // Buscamos la asistencia por fecha y alumno
        AsistenciaDTO asistenciaDTO = asistenciaService.buscarAsistenciaPorFecha(idAlumno, fecha);

        // Si encontramos la asistencia, la devolvemos, si no, respondemos con No Content
        return asistenciaDTO != null ? ResponseEntity.ok(asistenciaDTO) : ResponseEntity.noContent().build();
    }

    // 4. Ver historial completo de un alumno
    // GET http://localhost:8088/api/asistencias/historial/ALU01
    @GetMapping("/historial/{idAlumno}")
    public ResponseEntity<List<AsistenciaDTO>> listarHistorial(@PathVariable String idAlumno) {
        // Llamamos al servicio que devuelve una lista de AsistenciaDTO
        List<AsistenciaDTO> listaHistorial = asistenciaService.listarAsistenciasPorAlumno(idAlumno);

        // Devolvemos la lista de AsistenciaDTO con un HTTP 200 OK
        return ResponseEntity.ok(listaHistorial);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody AsistenciaDTO dto) {
        return ResponseEntity.ok(asistenciaService.actualizarAsistencia(id, dto));
    }
}
