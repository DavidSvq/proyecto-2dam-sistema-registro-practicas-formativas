package com.dam.proyecto.backend.controller;
import com.dam.proyecto.backend.model.Tarea;
import com.dam.proyecto.backend.service.ITareaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tareas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TareaController {

    private final ITareaService tareaService;

    // 1. EL TUTOR EMPRESA ASIGNA
    @PostMapping("/asignar")
    public ResponseEntity<Tarea> asignar(@RequestBody Tarea tarea) {
        return new ResponseEntity<>(tareaService.asignarTarea(tarea), HttpStatus.CREATED);
    }

    // 2. EL ALUMNO ACTUALIZA (Cambio de estado y horas reales)
    // Ej: /api/tareas/1/estado?nuevoEstado=COMPLETADA&horas=4.5
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Tarea> actualizarEstado(
            @PathVariable Long id,
            @RequestParam String nuevoEstado,
            @RequestParam(required = false) Double horas) {
        return ResponseEntity.ok(tareaService.actualizarEstadoAlumno(id, nuevoEstado, horas));
    }

    // 3. EL PROFESOR REVISA
    @PatchMapping("/{id}/revisar")
    public ResponseEntity<Tarea> revisar(@PathVariable Long id) {
        return ResponseEntity.ok(tareaService.revisarTarea(id));
    }

    // 4. CONSULTAS PARA EL FRONT
    @GetMapping("/alumno/{idAlumno}")
    public ResponseEntity<List<Tarea>> listarTodas(@PathVariable String idAlumno) {
        return ResponseEntity.ok(tareaService.obtenerTodasPorAlumno(idAlumno));
    }

    @GetMapping("/alumno/{idAlumno}/filtro")
    public ResponseEntity<List<Tarea>> filtrarPorEstado(
            @PathVariable String idAlumno,
            @RequestParam String estado) {
        return ResponseEntity.ok(tareaService.obtenerPorAlumnoYEstado(idAlumno, estado));
    }
}
