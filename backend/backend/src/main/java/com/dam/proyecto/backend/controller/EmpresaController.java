package com.dam.proyecto.backend.controller;

import com.dam.proyecto.backend.model.Empresa;
import com.dam.proyecto.backend.service.IEmpresaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empresas")
@CrossOrigin(origins = "*") // Permite que tu futuro Frontend en React/Angular se conecte sin bloqueos
public class EmpresaController {

    private final IEmpresaService empresaService;

    public EmpresaController(IEmpresaService empresaService) {
        this.empresaService = empresaService;
    }

    // LISTAR TODAS: GET http://localhost:8088/api/empresas
    @GetMapping
    public ResponseEntity<List<Empresa>> listarTodas() {
        List<Empresa> lista = empresaService.listarTodas();
        return ResponseEntity.ok(lista);
    }

    // BUSCAR UNA: GET http://localhost:8088/api/empresas/{cif}
    @GetMapping("/{cif}")
    public ResponseEntity<Empresa> obtenerPorCif(@PathVariable String cif) {
        return empresaService.buscarPorCif(cif)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREAR: POST http://localhost:8088/api/empresas
    @PostMapping
    public ResponseEntity<Empresa> crear(@RequestBody Empresa empresa) {
        try {
            Empresa nueva = empresaService.guardar(empresa);
            return new ResponseEntity<>(nueva, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ACTUALIZAR: PUT http://localhost:8088/api/empresas/{cif}
    @PutMapping("/{cif}")
    public ResponseEntity<Empresa> actualizar(@PathVariable String cif, @RequestBody Empresa empresa) {
        try {
            Empresa actualizada = empresaService.actualizar(cif, empresa);
            return ResponseEntity.ok(actualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ELIMINAR: DELETE http://localhost:8088/api/empresas/{cif}
    @DeleteMapping("/{cif}")
    public ResponseEntity<Void> eliminar(@PathVariable String cif) {
        try {
            empresaService.eliminar(cif);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
