package com.dam.proyecto.backend.service.impl.users;

import com.dam.proyecto.backend.model.Empresa;
import com.dam.proyecto.backend.model.enums.RolUsuario;
import com.dam.proyecto.backend.model.users.Alumno;
import com.dam.proyecto.backend.model.users.TutorEmpresa;
import com.dam.proyecto.backend.repository.EmpresaRepository;
import com.dam.proyecto.backend.repository.users.TutorEmpresaRepository;
import com.dam.proyecto.backend.service.users.ITutorEmpresaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TutorEmpresaServiceImpl implements ITutorEmpresaService {

    private final TutorEmpresaRepository tutorRepository;
    // Necesitaremos el repositorio de empresa para validar el registro
    private final EmpresaRepository empresaRepository;

    // --- MÉTODOS PARA EL GESTOR ---

    @Override
    @Transactional
    public TutorEmpresa registrarTutorEmpresa(TutorEmpresa tutor, String cifEmpresa) {
        log.info("Registrando nuevo tutor para la empresa con CIF: {}", cifEmpresa);

        Empresa empresa = empresaRepository.findById(cifEmpresa)
                .orElseThrow(() -> new RuntimeException("No se puede crear el tutor: La empresa no existe."));

        tutor.setEmpresa(empresa);
        // La contraseña debería venir ya encriptada desde el controlador/security
        return tutorRepository.save(tutor);
    }

    @Override
    @Transactional
    public TutorEmpresa actualizarTutor(String idTutor, TutorEmpresa datosNuevos) {
        TutorEmpresa tutorExistente = tutorRepository.findById(idTutor)
                .orElseThrow(() -> new RuntimeException("Tutor no encontrado"));

        log.info("Actualizando datos del tutor: {}", idTutor);
        tutorExistente.setNombre(datosNuevos.getNombre());
        tutorExistente.setApellidos(datosNuevos.getApellidos());
        tutorExistente.setEmail(datosNuevos.getEmail());
        // No actualizamos la empresa ni el password aquí por seguridad (tendrían sus propios métodos)

        return tutorRepository.save(tutorExistente);
    }

    @Override
    @Transactional
    public void eliminarTutor(String idTutor) {
        if (!tutorRepository.existsById(idTutor)) {
            throw new RuntimeException("El tutor que intenta eliminar no existe.");
        }
        log.warn("Eliminando tutor: {}", idTutor);
        tutorRepository.deleteById(idTutor);
    }

    @Override
    public List<TutorEmpresa> listarPorEmpresa(String cifEmpresa) {
        return tutorRepository.findByEmpresaCif(cifEmpresa);
    }

    // LOGIN
    @Override
    @Transactional(readOnly = true)
    public TutorEmpresa login(String email, String password, RolUsuario rol) {
        TutorEmpresa tutor = tutorRepository.findByEmailAndRol(email, rol)
                .orElseThrow(() -> new RuntimeException("TutorEmpresa no encontrado"));

        if (!tutor.getPassword().equals(password)) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        return tutor;
    }

    // --- Recuperar / cambiar contraseña ---
    @Override
    @Transactional
    public void recuperarPassword(String email, String nuevaPassword) {
        TutorEmpresa tutor = tutorRepository.findByEmailAndRol(email, RolUsuario.TUTOR_EMPRESA)
                .orElseThrow(() -> new RuntimeException("Tutor no encontrado"));

        tutor.setPassword(nuevaPassword);
        tutorRepository.save(tutor);
    }

    // --- MÉTODOS PARA EL TUTOR DE EMPRESA ---

    @Override
    public List<Alumno> listarMisAlumnos(String idTutor) {
        log.info("Recuperando alumnos para el tutor: {}", idTutor);
        return tutorRepository.findAlumnosAsignados(idTutor);
    }

    @Override
    public TutorEmpresa obtenerPerfil(String idTutor) {
        return tutorRepository.findById(idTutor)
                .orElseThrow(() -> new RuntimeException("Perfil no encontrado para ID: " + idTutor));
    }
}
