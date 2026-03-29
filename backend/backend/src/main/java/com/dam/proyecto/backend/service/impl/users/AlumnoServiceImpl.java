package com.dam.proyecto.backend.service.impl.users;

import com.dam.proyecto.backend.dto.alumno.AlumnoDTO;
import com.dam.proyecto.backend.dto.alumno.AlumnoMapper;
import com.dam.proyecto.backend.dto.login.LoginMapper;
import com.dam.proyecto.backend.dto.login.LoginResponseDTO;
import com.dam.proyecto.backend.model.enums.RolUsuario;
import com.dam.proyecto.backend.model.users.Alumno;
import com.dam.proyecto.backend.repository.users.AlumnoRepository;
import com.dam.proyecto.backend.service.users.IAlumnoService;
import com.dam.proyecto.backend.service.users.IProfesorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class AlumnoServiceImpl implements IAlumnoService {

    private final AlumnoRepository alumnoRepository;
    private final IProfesorService profesorService; // Para actualizar el contador de alumnos
    private final AlumnoMapper alumnoMapper;

    // 1. EL GESTOR CREA AL ALUMNO
    @Override
    @Transactional
    public Alumno guardar(Alumno alumno) {
        // Password por defecto si el Gestor no la pone
        if (alumno.getPassword() == null || alumno.getPassword().isEmpty()) {
            alumno.setPassword("1234");
        }

        Alumno guardado = alumnoRepository.save(alumno);

        // Si el Gestor ya le asignó un profesor, sumamos 1 a su carga docente
        if (guardado.getProfesor() != null) {
            profesorService.actualizarContadorAlumnos(guardado.getProfesor().getId(), 1);
        }

        return guardado;
    }

    // 2. EL GESTOR ACTUALIZA (Cambio de empresa, de tutor, etc.)
    @Override
    @Transactional
    public Alumno actualizar(String idAlumno, Alumno datosNuevos) {
        return alumnoRepository.findById(idAlumno)
                .map(a -> {
                    // Si el profesor cambia, gestionamos los contadores
                    if (a.getProfesor() != null && !a.getProfesor().getId().equals(datosNuevos.getProfesor().getId())) {
                        // Restamos al viejo, sumamos al nuevo
                        profesorService.actualizarContadorAlumnos(a.getProfesor().getId(), -1);
                        profesorService.actualizarContadorAlumnos(datosNuevos.getProfesor().getId(), 1);
                    }

                    a.setNombre(datosNuevos.getNombre());
                    a.setApellidos(datosNuevos.getApellidos());
                    a.setEmail(datosNuevos.getEmail());
                    a.setHorasTotales(datosNuevos.getHorasTotales());
                    a.setCentro(datosNuevos.getCentro());
                    a.setEmpresa(datosNuevos.getEmpresa());
                    a.setProfesor(datosNuevos.getProfesor());
                    a.setTutorEmpresa(datosNuevos.getTutorEmpresa());
                    return alumnoRepository.save(a);
                }).orElseThrow(() -> new RuntimeException("Alumno no encontrado"));
    }

    // LOGIN
    @Override
    @Transactional(readOnly = true)
    public LoginResponseDTO login(String email, String password, RolUsuario rol) {
        Alumno alumno = alumnoRepository.findByEmailAndRol(email, rol)
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));

        if (!alumno.getPassword().equals(password)) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        return LoginMapper.toDTO(alumno);
    }

    @Override
    public void recuperarPassword(String email, String nuevaPassword) {
        Alumno alumno = alumnoRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));

        alumno.setPassword(nuevaPassword);
        alumnoRepository.save(alumno); // actualiza en BBDD
    }
    // 3. BUSCADORES FILTRADOS

    @Override
    @Transactional(readOnly = true)
    public Optional<AlumnoDTO> obtenerPorId(String idAlumno) {
        // Recupera el Alumno desde el repositorio y convierte a AlumnoDTO
        return alumnoRepository.findById(idAlumno)
                .map(alumnoMapper::convertirAAlumnoDTO);  // Aquí se convierte Alumno a AlumnoDTO
    }

    @Override
    @Transactional(readOnly = true)
    public List<AlumnoDTO> listarPorCentro(String codCentro) {
        // Obtenemos la lista de Alumnos desde el repositorio
        List<Alumno> alumnos = alumnoRepository.findByCentroCodigoCentro(codCentro);

        // Convertimos cada Alumno a AlumnoDTO usando el mapper
        return alumnos.stream()
                .map(alumnoMapper::convertirAAlumnoDTO)  // Usamos el método del mapper para la conversión
                .collect(Collectors.toList());           // Recopilamos los resultados en una lista
    }

    @Override
    @Transactional(readOnly = true)
    public List<AlumnoDTO> listarPorTutorDocente(String idProfesor) {
        // Obtenemos la lista de Alumnos desde el repositorio, filtrados por el id del Profesor
        List<Alumno> alumnos = alumnoRepository.findByProfesorId(idProfesor);

        // Convertimos cada Alumno a AlumnoDTO usando el mapper
        return alumnos.stream()
                .map(alumnoMapper::convertirAAlumnoDTO)  // Usamos el método del mapper para la conversión
                .collect(Collectors.toList());           // Recopilamos los resultados en una lista
    }

    @Override
    @Transactional(readOnly = true)
    public List<AlumnoDTO> listarPorEmpresa(String cif) {
        // Obtenemos la lista de Alumnos desde el repositorio, filtrados por el CIF de la Empresa
        List<Alumno> alumnos = alumnoRepository.findByEmpresaCif(cif);

        // Convertimos cada Alumno a AlumnoDTO usando el mapper
        return alumnos.stream()
                .map(alumnoMapper::convertirAAlumnoDTO)  // Usamos el método del mapper para la conversión
                .collect(Collectors.toList());           // Recopilamos los resultados en una lista
    }

    // 4. ELIMINAR (Baja del alumno)
    @Override
    @Transactional
    public void eliminar(String idAlumno) {
        alumnoRepository.findById(idAlumno).ifPresent(a -> {
            // Si tenía profesor, le liberamos la carga
            if (a.getProfesor() != null) {
                profesorService.actualizarContadorAlumnos(a.getProfesor().getId(), -1);
            }
            alumnoRepository.delete(a);
        });
    }

    @Override
    @Transactional
    public void registrarHoras(String idAlumno, int horasNuevas) {
        alumnoRepository.findById(idAlumno).ifPresent(a -> {
            a.setHorasTotales(a.getHorasTotales() + horasNuevas);
            alumnoRepository.save(a);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public List<AlumnoDTO> listarHuerfanos() {
        // Obtenemos la lista de Alumnos donde la FK_PROFESOR es NULL
        List<Alumno> alumnosHuerfanos = alumnoRepository.findByProfesorIsNull();

        // Convertimos cada Alumno en AlumnoDTO usando el mapper
        return alumnosHuerfanos.stream()
                .map(alumnoMapper::convertirAAlumnoDTO)  // Usamos el método del mapper para la conversión
                .collect(Collectors.toList());           // Recopilamos los resultados en una lista
    }
}
