package com.dam.proyecto.backend.service.impl.users;

import com.dam.proyecto.backend.model.users.TutorEmpresa;
import com.dam.proyecto.backend.repository.users.TutorEmpresaRepository;
import com.dam.proyecto.backend.service.users.ITutorEmpresaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TutorEmpresaServiceImpl implements ITutorEmpresaService {

    private final TutorEmpresaRepository tutorRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TutorEmpresa> listarTodos() {
        return tutorRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<TutorEmpresa> obtenerPorId(String id) {
        return tutorRepository.findById(id);
    }

    @Override
    @Transactional
    public TutorEmpresa guardar(TutorEmpresa tutor) {
        return tutorRepository.save(tutor);
    }

    @Override
    @Transactional
    public void eliminar(String id) {
        tutorRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TutorEmpresa> listarPorEmpresa(String cif) {
        return tutorRepository.findByEmpresaCif(cif);
    }
}
