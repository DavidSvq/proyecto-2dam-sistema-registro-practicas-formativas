package com.dam.proyecto.backend.controller;

import com.dam.proyecto.backend.dto.empresa.EmpresaDTO;
import com.dam.proyecto.backend.dto.empresa.EmpresaMapper;
import com.dam.proyecto.backend.model.Empresa;
import com.dam.proyecto.backend.service.IEmpresaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empresas")
@CrossOrigin(origins = "*")
public class EmpresaController {

    private final IEmpresaService empresaService;
    // Inyectamos el mapper de manera automática
    @Autowired
    private EmpresaMapper empresaMapper;

    public EmpresaController(IEmpresaService empresaService) {
        this.empresaService = empresaService;
    }

    // 1. BUSCAR POR CIF (DETALLE): GET /api/empresas/{cif}
    @GetMapping("/{cif}")
    public ResponseEntity<EmpresaDTO> obtenerPorCif(@PathVariable String cif) {
        return empresaService.obtenerPorCif(cif)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 2. BUSCADOR POR NOMBRE: GET /api/empresas/buscar?nombre=Tech
    @GetMapping("/buscar")
    public ResponseEntity<List<EmpresaDTO>> buscarPorNombre(@RequestParam String nombre) {
        List<EmpresaDTO> empresas = empresaService.buscarPorNombre(nombre);
        return ResponseEntity.ok(empresas);
    }

    // 3. LISTAR POR CENTRO: GET /api/empresas/centro/CEN01
    @GetMapping("/centro/{codigoCentro}")
    public ResponseEntity<List<EmpresaDTO>> listarPorCentro(@PathVariable String codigoCentro) {
        List<EmpresaDTO> empresas = empresaService.listarEmpresasPorCentro(codigoCentro);
        return ResponseEntity.ok(empresas);
    }

    // 4. EMPRESA DE UN ALUMNO: GET /api/empresas/alumno/ALU01
    @GetMapping("/alumno/{idAlumno}")
    public ResponseEntity<EmpresaDTO> obtenerEmpresaDeAlumno(@PathVariable String idAlumno) {
        return empresaService.obtenerEmpresaDeAlumno(idAlumno)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 5. CREAR: POST /api/empresas
    @PostMapping
    public ResponseEntity<EmpresaDTO> crear(@RequestBody Empresa empresa) {
        Empresa empresaGuardada = empresaService.guardar(empresa);
        return new ResponseEntity<>(empresaMapper.convertirAEmpresaDTO(empresaGuardada), HttpStatus.CREATED);
    }

    // 6. ACTUALIZAR: PUT /api/empresas/{cif}
    @PutMapping("/{cif}")
    public ResponseEntity<EmpresaDTO> actualizar(@PathVariable String cif, @RequestBody Empresa empresa) {
        try {
            Empresa empresaActualizada = empresaService.actualizar(cif, empresa);
            return ResponseEntity.ok(empresaMapper.convertirAEmpresaDTO(empresaActualizada));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 7. ELIMINAR: DELETE /api/empresas/{cif}
    @DeleteMapping("/{cif}")
    public ResponseEntity<Void> eliminar(@PathVariable String cif) {
        empresaService.eliminar(cif);
        return ResponseEntity.noContent().build();
    }
}
