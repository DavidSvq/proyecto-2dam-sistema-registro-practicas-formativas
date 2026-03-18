package com.dam.proyecto.backend.service.impl.users;

import com.dam.proyecto.backend.model.users.Profesor;
import com.dam.proyecto.backend.model.enums.RolDocente;
import com.dam.proyecto.backend.repository.users.ProfesorRepository;
import com.dam.proyecto.backend.service.users.IProfesorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProfesorServiceImpl implements IProfesorService {

    private final ProfesorRepository profesorRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Profesor> listarTodos() {
        return profesorRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Profesor> obtenerPorId(String id) {
        return profesorRepository.findById(id);
    }

    @Override
    @Transactional
    public Profesor guardar(Profesor profesor) {
        return profesorRepository.save(profesor);
    }

    @Override
    @Transactional
    public void eliminar(String id) {
        profesorRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Profesor> listarPorRol(RolDocente rol) {
        return profesorRepository.findByRol(rol);
    }
}
