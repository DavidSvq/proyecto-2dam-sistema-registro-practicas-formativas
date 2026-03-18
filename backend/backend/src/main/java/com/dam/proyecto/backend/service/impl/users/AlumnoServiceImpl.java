package com.dam.proyecto.backend.service.impl.users;

import com.dam.proyecto.backend.model.users.Alumno;
import com.dam.proyecto.backend.repository.users.AlumnoRepository;
import com.dam.proyecto.backend.service.users.IAlumnoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AlumnoServiceImpl implements IAlumnoService {

    private final AlumnoRepository alumnoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Alumno> listarTodos() {
        return alumnoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Alumno> obtenerPorId(String id) {
        return alumnoRepository.findById(id);
    }

    @Override
    @Transactional
    public Alumno guardar(Alumno alumno) {
        return alumnoRepository.save(alumno);
    }

    @Override
    @Transactional
    public void eliminar(String id) {
        alumnoRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Alumno> listarPorProfesor(String profesorId) {
        return alumnoRepository.findByProfesorId(profesorId);
    }
}
