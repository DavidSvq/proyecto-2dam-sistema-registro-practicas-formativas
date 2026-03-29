package com.dam.proyecto.backend.controller.users;

import com.dam.proyecto.backend.dto.alumno.AlumnoDTO;
import com.dam.proyecto.backend.dto.alumno.AlumnoMapper;
import com.dam.proyecto.backend.dto.login.LoginRequestDTO;
import com.dam.proyecto.backend.dto.login.LoginResponseDTO;
import com.dam.proyecto.backend.model.users.Alumno;
import com.dam.proyecto.backend.service.users.IAlumnoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alumnos")
@CrossOrigin(origins = "*")
public class AlumnoController {

    private final IAlumnoService alumnoService;
    //private final AlumnoMapper alumnoMapper;

    public AlumnoController(IAlumnoService alumnoService) {
        this.alumnoService = alumnoService;
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        try {
            LoginResponseDTO logged = alumnoService.login(
                    request.getEmail(),
                    request.getPassword(),
                    request.getRol()
            );
            return ResponseEntity.ok(logged);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // --- Recuperar / Actualizar contraseña ---
    @PutMapping("/recuperar-password")
    public ResponseEntity<Void> recuperarPassword(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String nuevaPassword = body.get("nuevaPassword");
            alumnoService.recuperarPassword(email, nuevaPassword);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
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
    public ResponseEntity<AlumnoDTO> obtenerPorId(@PathVariable String id) {
        return alumnoService.obtenerPorId(id)
                .map(ResponseEntity::ok)  // Responde con 200 OK si se encuentra
                .orElse(ResponseEntity.notFound().build()); // Si no se encuentra, retorna 404
    }

    // 3. LISTAR POR CENTRO: GET /api/alumnos/centro/CEN01
    @GetMapping("/centro/{codCentro}")
    public ResponseEntity<List<AlumnoDTO>> listarPorCentro(@PathVariable String codCentro) {
        List<AlumnoDTO> alumnosDTO = alumnoService.listarPorCentro(codCentro);
        return ResponseEntity.ok(alumnosDTO);
    }

    // 4. EL FILTRO DE HUÉRFANOS: GET /api/alumnos/huerfanos
    // Clave para que el Gestor sepa a quién le falta tutor docente
    @GetMapping("/huerfanos")
    public ResponseEntity<List<AlumnoDTO>> listarSinTutor() {
        List<AlumnoDTO> alumnosDTO = alumnoService.listarHuerfanos();
        return ResponseEntity.ok(alumnosDTO);
    }

    // 5. LISTAR POR TUTOR DOCENTE: GET /api/alumnos/tutor/DOC002
    @GetMapping("/tutor/{idProfesor}")
    public ResponseEntity<List<AlumnoDTO>> listarPorTutor(@PathVariable String idProfesor) {
        List<AlumnoDTO> alumnosDTO = alumnoService.listarPorTutorDocente(idProfesor);
        return ResponseEntity.ok(alumnosDTO);
    }

    // 6. LISTAR POR EMPRESA: GET /api/alumnos/empresa/CIF001
    @GetMapping("/empresa/{cif}")
    public ResponseEntity<List<AlumnoDTO>> listarPorEmpresa(@PathVariable String cif) {
        List<AlumnoDTO> alumnosDTO = alumnoService.listarPorEmpresa(cif);
        return ResponseEntity.ok(alumnosDTO);
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
