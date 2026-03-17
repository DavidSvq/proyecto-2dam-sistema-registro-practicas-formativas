package com.dam.proyecto.backend.controller;

import com.dam.proyecto.backend.model.CentroDocente;
import com.dam.proyecto.backend.service.ICentroDocenteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/centros") // Todas las URLs de este controlador empezarán por aquí
@CrossOrigin(origins = "*")    // Para que React no tenga problemas de permisos (CORS)
public class CentroDocenteController {

    private final ICentroDocenteService centroService;

    public CentroDocenteController(ICentroDocenteService centroService) {
        this.centroService = centroService;
    }

    // GET: http://localhost:8088/api/centros/{codigo}
    @GetMapping("/{codigo}")
    public ResponseEntity<CentroDocente> obtenerCentro(@PathVariable String codigo) {
        return centroService.buscarPorCodigo(codigo)
                .map(centro -> ResponseEntity.ok().body(centro)) // Si existe, devuelve 200 OK + el centro
                .orElse(ResponseEntity.notFound().build());      // Si no existe, devuelve 404 Not Found
    }

    // POST: http://localhost:8088/api/centros (Para guardar o actualizar)
    @PostMapping
    public ResponseEntity<CentroDocente> guardarCentro(@RequestBody CentroDocente centro) {
        CentroDocente guardado = centroService.guardarOActualizar(centro);
        return ResponseEntity.ok(guardado);
    }
}
