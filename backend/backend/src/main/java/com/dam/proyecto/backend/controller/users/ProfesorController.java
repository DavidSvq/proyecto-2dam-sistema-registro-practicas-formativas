package com.dam.proyecto.backend.controller.users;

import com.dam.proyecto.backend.model.users.Profesor;
import com.dam.proyecto.backend.service.users.IProfesorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profesores")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Permitir peticiones desde cualquier origen (ajustar en producción)
public class ProfesorController {

    private final IProfesorService profesorService;

    // 1. Obtener todos
    @GetMapping
    public ResponseEntity<List<Profesor>> listar() {
        return ResponseEntity.ok(profesorService.listarTodos());
    }

    // 2. Obtener uno por ID
    @GetMapping("/{id}")
    public ResponseEntity<Profesor> obtenerPorId(@PathVariable String id) {
        return profesorService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Crear nuevo Profesor
    @PostMapping
    public ResponseEntity<Profesor> crear(@RequestBody Profesor profesor) {
        Profesor nuevoProfesor = profesorService.guardar(profesor);
        return new ResponseEntity<>(nuevoProfesor, HttpStatus.CREATED);
    }

    // 4. Actualizar Profesor
    @PutMapping("/{id}")
    public ResponseEntity<Profesor> actualizar(@PathVariable String id, @RequestBody Profesor profesor) {
        return profesorService.obtenerPorId(id)
                .map(p -> {
                    profesor.setId(id); // Aseguramos que mantenga el ID de la URL
                    return ResponseEntity.ok(profesorService.guardar(profesor));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 5. Eliminar Profesor
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        if (profesorService.obtenerPorId(id).isPresent()) {
            profesorService.eliminar(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
