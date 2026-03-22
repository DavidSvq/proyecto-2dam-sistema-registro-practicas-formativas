package com.dam.proyecto.backend.controller.users;

import com.dam.proyecto.backend.model.users.Alumno;
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

    // --- ACCIONES DEL PROFESOR GESTOR ---

    @PostMapping("/empresa/{cifEmpresa}")
    public ResponseEntity<TutorEmpresa> registrar(@RequestBody TutorEmpresa tutor, @PathVariable String cifEmpresa) {
        // Llama a: registrarTutorEmpresa(TutorEmpresa tutor, String cifEmpresa)
        return new ResponseEntity<>(tutorService.registrarTutorEmpresa(tutor, cifEmpresa), HttpStatus.CREATED);
    }

    @PutMapping("/{idTutor}")
    public ResponseEntity<TutorEmpresa> actualizar(@PathVariable String idTutor, @RequestBody TutorEmpresa tutor) {
        // Llama a: actualizarTutorEmpresa(String idTutor, TutorEmpresa datosNuevos)
        return ResponseEntity.ok(tutorService.actualizarTutor(idTutor, tutor));
    }

    @DeleteMapping("/{idTutor}")
    public ResponseEntity<Void> eliminar(@PathVariable String idTutor) {
        // Llama a: eliminarTutorEmpresa(String idTutor)
        tutorService.eliminarTutor(idTutor);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/empresa/{cifEmpresa}")
    public ResponseEntity<List<TutorEmpresa>> listarPorEmpresa(@PathVariable String cifEmpresa) {
        // Llama a: listarTutoresPorEmpresa(String cifEmpresa)
        return ResponseEntity.ok(tutorService.listarPorEmpresa(cifEmpresa));
    }

    // --- ACCIONES DEL TUTOR DE EMPRESA ---

    @GetMapping("/{idTutor}/alumnos")
    public ResponseEntity<List<Alumno>> listarMisAlumnos(@PathVariable String idTutor) {
        // Llama a: listarMisAlumnos(String idTutor)
        return ResponseEntity.ok(tutorService.listarMisAlumnos(idTutor));
    }

    @GetMapping("/{idTutor}/perfil")
    public ResponseEntity<TutorEmpresa> obtenerPerfil(@PathVariable String idTutor) {
        // Llama a: obtenerPerfil(String idTutor)
        return ResponseEntity.ok(tutorService.obtenerPerfil(idTutor));
    }
}
