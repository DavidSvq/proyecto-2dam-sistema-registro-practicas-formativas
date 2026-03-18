package com.dam.proyecto.backend.service.users;

import com.dam.proyecto.backend.model.users.TutorEmpresa;
import java.util.List;
import java.util.Optional;

public interface ITutorEmpresaService {
    List<TutorEmpresa> listarTodos();
    Optional<TutorEmpresa> obtenerPorId(String id);
    TutorEmpresa guardar(TutorEmpresa tutor);
    void eliminar(String id);
    List<TutorEmpresa> listarPorEmpresa(String cif);
}
