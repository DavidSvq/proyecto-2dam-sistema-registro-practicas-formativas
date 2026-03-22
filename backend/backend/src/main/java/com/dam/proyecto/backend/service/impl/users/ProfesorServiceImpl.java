package com.dam.proyecto.backend.service.impl.users;

import com.dam.proyecto.backend.model.users.Profesor;
import com.dam.proyecto.backend.model.enums.RolDocente;
import com.dam.proyecto.backend.repository.users.ProfesorRepository;
import com.dam.proyecto.backend.service.users.IProfesorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfesorServiceImpl implements IProfesorService {

    private final ProfesorRepository profesorRepository;

    // 1. EL GESTOR CREA UN PROFESOR (Con su email y pass inicial)
    @Override
    @Transactional
    public Profesor guardar(Profesor profesor) {
        // Si el gestor no puso password, asignamos una genérica "1234"
        if (profesor.getPassword() == null || profesor.getPassword().isEmpty()) {
            profesor.setPassword("1234");
        }
        return profesorRepository.save(profesor);
    }

    // 2. ACTUALIZAR DATOS DEL PROFESOR
    @Override
    @Transactional
    public Profesor actualizar(String idProfesor, Profesor datosNuevos) {
        return profesorRepository.findById(idProfesor)
                .map(p -> {
                    p.setNombre(datosNuevos.getNombre());
                    p.setApellidos(datosNuevos.getApellidos());
                    p.setEmail(datosNuevos.getEmail());
                    p.setRol(datosNuevos.getRol());
                    p.setCentro(datosNuevos.getCentro());
                    // No actualizamos la password aquí por seguridad (iría en otro método)
                    return profesorRepository.save(p);
                }).orElseThrow(() -> new RuntimeException("Profesor no encontrado: " + idProfesor));
    }

    @Override
    @Transactional
    public void eliminarProfesor(String idProfesor) {
        log.warn("Eliminando docente ID: {}", idProfesor);
        if (!profesorRepository.existsById(idProfesor)) {
            throw new RuntimeException("No existe el docente a eliminar");
        }
        profesorRepository.deleteById(idProfesor);
    }
    // 3. BUSCADORES (Para el Login y Perfil)
    @Override
    @Transactional(readOnly = true)
    public Optional<Profesor> buscarPorEmail(String email) {
        return profesorRepository.findByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Profesor> obtenerPorId(String idProfesor) {
        return profesorRepository.findById(idProfesor);
    }

    // 4. VISTAS PARA EL GESTOR (Filtrado por Centro y Rol)
    @Override
    @Transactional(readOnly = true)
    public List<Profesor> listarPorCentro(String codCentro) {
        return profesorRepository.findByCentro(codCentro);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Profesor> listarTutoresPorCentro(String codCentro, RolDocente rol) {
        // Usamos el RolDocente.TUTOR para filtrar la lista
        return profesorRepository.findByCentroAndRol(codCentro, RolDocente.TUTOR);
    }

    // 5. RELACIÓN CON EL ALUMNO (Native Query)
    @Override
    @Transactional(readOnly = true)
    public Optional<Profesor> obtenerProfesorDeAlumno(String idAlumno) {
        return profesorRepository.findProfesorByAlumnoId(idAlumno);
    }

    // 6. LÓGICA DE CARGA (Para cuando asignemos alumnos en el futuro)
    @Override
    @Transactional
    public void actualizarContadorAlumnos(String idProfesor, int incremento) {
        profesorRepository.findById(idProfesor).ifPresent(p -> {
            p.setNumAlumnos(p.getNumAlumnos() + incremento);
            profesorRepository.save(p);
        });
    }
}
