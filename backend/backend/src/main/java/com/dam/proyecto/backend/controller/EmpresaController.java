package com.dam.proyecto.backend.controller;

import com.dam.proyecto.backend.model.Empresa;
import com.dam.proyecto.backend.service.IEmpresaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empresas")
@CrossOrigin(origins = "*")
public class EmpresaController {

    private final IEmpresaService empresaService;

    public EmpresaController(IEmpresaService empresaService) {
        this.empresaService = empresaService;
    }

    // 1. BUSCAR POR CIF (DETALLE): GET /api/empresas/{cif}
    @GetMapping("/{cif}")
    public ResponseEntity<Empresa> obtenerPorCif(@PathVariable String cif) {
        return empresaService.obtenerPorCif(cif)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 2. BUSCADOR POR NOMBRE: GET /api/empresas/buscar?nombre=Tech
    @GetMapping("/buscar")
    public ResponseEntity<List<Empresa>> buscarPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(empresaService.buscarPorNombre(nombre));
    }

    // 3. LISTAR POR CENTRO: GET /api/empresas/centro/CEN01
    @GetMapping("/centro/{codigoCentro}")
    public ResponseEntity<List<Empresa>> listarPorCentro(@PathVariable String codigoCentro) {
        return ResponseEntity.ok(empresaService.listarEmpresasPorCentro(codigoCentro));
    }

    // 4. EMPRESA DE UN ALUMNO: GET /api/empresas/alumno/ALU01
    @GetMapping("/alumno/{idAlumno}")
    public ResponseEntity<Empresa> obtenerEmpresaDeAlumno(@PathVariable String idAlumno) {
        return empresaService.obtenerEmpresaDeAlumno(idAlumno)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 5. CREAR: POST /api/empresas
    @PostMapping
    public ResponseEntity<Empresa> crear(@RequestBody Empresa empresa) {
        return new ResponseEntity<>(empresaService.guardar(empresa), HttpStatus.CREATED);
    }

    // 6. ACTUALIZAR: PUT /api/empresas/{cif}
    @PutMapping("/{cif}")
    public ResponseEntity<Empresa> actualizar(@PathVariable String cif, @RequestBody Empresa empresa) {
        try {
            return ResponseEntity.ok(empresaService.actualizar(cif, empresa));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{cif}")
    public ResponseEntity<Void> eliminar(@PathVariable String cif) {
        empresaService.eliminar(cif);
        return ResponseEntity.noContent().build();
    }
}
