package com.dam.proyecto.backend.controller;
import com.dam.proyecto.backend.dto.tarea.TareaDTO;
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

    // 1. CREAR TAREA (El Front envía el JSON con idAlumno, idTutor, etc.)
    @PostMapping
    public ResponseEntity<Tarea> crear(@RequestBody Tarea tarea) {
        return new ResponseEntity<>(tareaService.crearTarea(tarea), HttpStatus.CREATED);
    }

    // 2. ASIGNAR TAREA (Activa la tarea, pone fecha y estado ASIGNADA)
    @PutMapping("/{id}/asignar")
    public ResponseEntity<Tarea> asignar(@PathVariable Long id) {
        return ResponseEntity.ok(tareaService.asignarTarea(id));
    }

    // 3. MODIFICAR TAREA (Para corregir títulos o descripciones)
    @PutMapping("/{id}")
    public ResponseEntity<Tarea> modificar(@PathVariable Long id, @RequestBody Tarea tarea) {
        return ResponseEntity.ok(tareaService.modificarTarea(id, tarea));
    }

    // 4. ELIMINAR TAREA
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        tareaService.eliminarTarea(id);
        return ResponseEntity.noContent().build();
    }

    // --- GESTIÓN DE ESTADOS Y FILTROS ---

    // El Alumno cambia el estado (ej: a COMPLETADA enviando horasReales)
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Tarea> actualizarEstado(
            @PathVariable Long id,
            @RequestParam String nuevoEstado,
            @RequestParam(required = false) Double horas) {
        return ResponseEntity.ok(tareaService.actualizarEstadoAlumno(id, nuevoEstado, horas));
    }

    // El Profesor revisa la tarea
    @PatchMapping("/{id}/revisar")
    public ResponseEntity<Tarea> revisar(@PathVariable Long id) {
        return ResponseEntity.ok(tareaService.revisarTarea(id));
    }

    // Listado por Alumno
    @GetMapping("/alumno/{idAlumno}")
    public ResponseEntity<List<TareaDTO>> listarPorAlumno(@PathVariable String idAlumno) {
        List<TareaDTO> tareasDTO = tareaService.obtenerTodasPorAlumno(idAlumno);
        return ResponseEntity.ok(tareasDTO);
    }

    // Listado por Tutor de Empresa y Estado
    @GetMapping("/tutor/{idTutor}/estado/{estado}")
    public ResponseEntity<List<TareaDTO>> listarPorTutorYEstado(
            @PathVariable String idTutor,
            @PathVariable String estado) {
        List<TareaDTO> tareasDTO = tareaService.obtenerPorTutorEmpresaYEstado(idTutor, estado);
        return ResponseEntity.ok(tareasDTO);
    }
    @GetMapping("/tutor/{idTutor}")
    public ResponseEntity<List<TareaDTO>> listarTodasPorTutor(@PathVariable String idTutor) {
        List<TareaDTO> tareasDTO = tareaService.obtenerTodasPorTutorEmpresa(idTutor);
        return ResponseEntity.ok(tareasDTO);
    }
}
