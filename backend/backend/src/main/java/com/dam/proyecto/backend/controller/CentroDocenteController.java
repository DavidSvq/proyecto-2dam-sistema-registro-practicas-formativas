package com.dam.proyecto.backend.controller;

import com.dam.proyecto.backend.dto.centro.CentroDocenteDTO;
import com.dam.proyecto.backend.model.CentroDocente;
import com.dam.proyecto.backend.service.ICentroDocenteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/centros")
@CrossOrigin(origins = "*")
public class CentroDocenteController {

    private final ICentroDocenteService centroService;

    public CentroDocenteController(ICentroDocenteService centroService) {
        this.centroService = centroService;
    }

    // 1. ACCESO RÁPIDO AL CENTRO PRINCIPAL: GET /api/centros/principal
    // Ideal para cargar la cabecera de la App sin saber el código.
    @GetMapping("/principal")
    public ResponseEntity<CentroDocenteDTO> obtenerCentroPrincipal() {
        return centroService.obtenerCentroPrincipal()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 2. DETALLE POR CÓDIGO: GET /api/centros/CEN01
    @GetMapping("/{codigo}")
    public ResponseEntity<CentroDocenteDTO> obtenerPorCodigo(@PathVariable String codigo) {
        return centroService.obtenerPorCodigo(codigo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. CENTRO DE UN ALUMNO: GET /api/centros/alumno/ALU01
    @GetMapping("/alumno/{idAlumno}")
    public ResponseEntity<CentroDocenteDTO> obtenerCentroDeAlumno(@PathVariable String idAlumno) {
        return centroService.obtenerCentroDeAlumno(idAlumno)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    // 4. CREAR: POST /api/centros
    @PostMapping
    public ResponseEntity<CentroDocente> crear(@RequestBody CentroDocente centro) {
        return new ResponseEntity<>(centroService.guardar(centro), HttpStatus.CREATED);
    }

    // 5. ACTUALIZAR: PUT /api/centros/{codigo}
    @PutMapping("/{codigo}")
    public ResponseEntity<CentroDocente> actualizar(@PathVariable String codigo, @RequestBody CentroDocente centro) {
        try {
            return ResponseEntity.ok(centroService.actualizar(codigo, centro));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        centroService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
