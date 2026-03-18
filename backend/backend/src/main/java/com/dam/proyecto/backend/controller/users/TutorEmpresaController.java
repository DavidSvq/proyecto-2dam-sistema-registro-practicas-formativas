package com.dam.proyecto.backend.controller.users;

import com.dam.proyecto.backend.model.users.TutorEmpresa;
import com.dam.proyecto.backend.service.users.ITutorEmpresaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tutores-empresa")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TutorEmpresaController {

    private final ITutorEmpresaService tutorService;

    @GetMapping
    public ResponseEntity<List<TutorEmpresa>> listar() {
        return ResponseEntity.ok(tutorService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TutorEmpresa> obtenerPorId(@PathVariable String id) {
        return tutorService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/empresa/{cif}")
    public ResponseEntity<List<TutorEmpresa>> listarPorEmpresa(@PathVariable String cif) {
        return ResponseEntity.ok(tutorService.listarPorEmpresa(cif));
    }

    @PostMapping
    public ResponseEntity<TutorEmpresa> crear(@RequestBody TutorEmpresa tutor) {
        return new ResponseEntity<>(tutorService.guardar(tutor), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        tutorService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
