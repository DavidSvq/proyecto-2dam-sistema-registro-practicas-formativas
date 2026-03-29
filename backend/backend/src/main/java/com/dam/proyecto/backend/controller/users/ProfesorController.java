package com.dam.proyecto.backend.controller.users;

import com.dam.proyecto.backend.dto.login.LoginRequestDTO;
import com.dam.proyecto.backend.dto.login.LoginResponseDTO;
import com.dam.proyecto.backend.dto.profesor.ProfesorDTO;
import com.dam.proyecto.backend.model.enums.RolUsuario;
import com.dam.proyecto.backend.model.users.Profesor;
import com.dam.proyecto.backend.service.users.IProfesorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profesores")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfesorController {

    private final IProfesorService profesorService;

    // --- LOGIN ---
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        try {
            LoginResponseDTO logged = profesorService.login(
                    request.getEmail(),
                    request.getPassword(),
                    request.getRol()
            );
            return ResponseEntity.ok(logged);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PutMapping("/recuperar-password")
    public ResponseEntity<Void> recuperarPassword(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String nuevaPassword = body.get("nuevaPassword");
            profesorService.recuperarPassword(email, nuevaPassword);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // 1. REGISTRO: POST /api/profesores
    @PostMapping
    public ResponseEntity<Profesor> crearProfesor(@RequestBody Profesor profesor) {
        // Llama a: guardar(Profesor profesor)
        return new ResponseEntity<>(profesorService.guardar(profesor), HttpStatus.CREATED);
    }

    // 2. BUSCAR POR ID: GET /api/profesores/DOC001
    @GetMapping("/{id}")
    public ResponseEntity<ProfesorDTO> obtenerProfesorPorId(@PathVariable String id) {
        // Llama a: obtenerProfesorPorId(String idProfesor)
        return profesorService.obtenerProfesorPorId(id)
                .map(ResponseEntity::ok) // Devolver el DTO si lo encuentra
                .orElse(ResponseEntity.notFound().build()); // Si no lo encuentra, devolver un 404
    }

    // 3. LISTAR POR CENTRO Y ROL: GET /api/profesores/centro/CEN01?rol=TUTOR
    @GetMapping("/centro/{codCentro}")
    public ResponseEntity<List<ProfesorDTO>> listarPorCentro(
            @PathVariable String codCentro,
            @RequestParam(required = false) RolUsuario rol) {

        if (rol != null) {
            // Llama a: listarTutoresPorCentro(String codCentro, RolUsuario rol)
            return ResponseEntity.ok(profesorService.listarTutoresPorCentro(codCentro, rol));
        }
        // Llama a: listarPorCentro(String codCentro)
        return ResponseEntity.ok(profesorService.listarPorCentro(codCentro));
    }

    // 4. ACTUALIZAR: PUT /api/profesores/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Profesor> actualizar(@PathVariable String id, @RequestBody Profesor profesor) {
        try {
            // Llama a: actualizar(String idProfesor, Profesor datosNuevos)
            return ResponseEntity.ok(profesorService.actualizar(id, profesor));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 5. ELIMINAR: DELETE /api/profesores/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        // Llama a: eliminarProfesor(String idProfesor)
        profesorService.eliminarProfesor(id);
        return ResponseEntity.noContent().build();
    }

    // 6. VER EL PROFESOR DE UN ALUMNO: GET /api/profesores/alumno/ALU01
    @GetMapping("/alumno/{idAlumno}")
    public ResponseEntity<ProfesorDTO> obtenerTutorDeAlumno(@PathVariable String idAlumno) {
        // Llama a: obtenerProfesorDeAlumno(String idAlumno)
        return profesorService.obtenerProfesorDeAlumno(idAlumno)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}