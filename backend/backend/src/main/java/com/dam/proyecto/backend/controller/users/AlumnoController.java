package com.dam.proyecto.backend.controller.users;

import com.dam.proyecto.backend.model.users.Alumno;
import com.dam.proyecto.backend.service.users.IAlumnoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alumnos")
@CrossOrigin(origins = "*")
public class AlumnoController {

    private final IAlumnoService alumnoService;

    public AlumnoController(IAlumnoService alumnoService) {
        this.alumnoService = alumnoService;
    }

    // 1. CREAR ALUMNO: POST /api/alumnos
    // El Gestor da de alta al alumno. Si no envía password, el Service pondrá "1234"
    @PostMapping
    public ResponseEntity<Alumno> crearAlumno(@RequestBody Alumno alumno) {
        Alumno nuevo = alumnoService.guardar(alumno);
        return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
    }

    // 2. BUSCAR POR ID: GET /api/alumnos/ALU01
    @GetMapping("/{id}")
    public ResponseEntity<Alumno> obtenerPorId(@PathVariable String id) {
        // Asumimos que tienes un método obtenerPorId en el Service
        return alumnoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. LISTAR POR CENTRO: GET /api/alumnos/centro/CEN01
    @GetMapping("/centro/{codCentro}")
    public ResponseEntity<List<Alumno>> listarPorCentro(@PathVariable String codCentro) {
        return ResponseEntity.ok(alumnoService.listarPorCentro(codCentro));
    }

    // 4. EL FILTRO DE HUÉRFANOS: GET /api/alumnos/huerfanos
    // Clave para que el Gestor sepa a quién le falta tutor docente
    @GetMapping("/huerfanos")
    public ResponseEntity<List<Alumno>> listarSinTutor() {
        return ResponseEntity.ok(alumnoService.listarHuerfanos());
    }

    // 5. LISTAR POR TUTOR DOCENTE: GET /api/alumnos/tutor/DOC002
    @GetMapping("/tutor/{idProfesor}")
    public ResponseEntity<List<Alumno>> listarPorTutor(@PathVariable String idProfesor) {
        return ResponseEntity.ok(alumnoService.listarPorTutorDocente(idProfesor));
    }

    // 6. LISTAR POR EMPRESA: GET /api/alumnos/empresa/CIF001
    @GetMapping("/empresa/{cif}")
    public ResponseEntity<List<Alumno>> listarPorEmpresa(@PathVariable String cif) {
        return ResponseEntity.ok(alumnoService.listarPorEmpresa(cif));
    }

    // 7. ACTUALIZAR: PUT /api/alumnos/ALU01
    // Aquí el Gestor cambia la empresa o el tutor asignado
    @PutMapping("/{id}")
    public ResponseEntity<Alumno> actualizar(@PathVariable String id, @RequestBody Alumno alumno) {
        try {
            return ResponseEntity.ok(alumnoService.actualizar(id, alumno));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 8. ELIMINAR: DELETE /api/alumnos/ALU01
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        alumnoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // 9. REGISTRAR HORAS: PATCH /api/alumnos/ALU01/horas/8
    // Usamos PATCH porque solo modificamos un campo (las horas)
    @PatchMapping("/{id}/horas/{cantidad}")
    public ResponseEntity<Void> sumarHoras(@PathVariable String id, @PathVariable int cantidad) {
        alumnoService.registrarHoras(id, cantidad);
        return ResponseEntity.ok().build();
    }
}
