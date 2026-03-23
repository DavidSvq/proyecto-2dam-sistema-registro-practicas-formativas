package com.dam.proyecto.backend.service.impl;

import com.dam.proyecto.backend.model.CentroDocente;
import com.dam.proyecto.backend.repository.CentroDocenteRepository;
import com.dam.proyecto.backend.service.ICentroDocenteService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CentroDocenteServiceImpl implements ICentroDocenteService {

    private final CentroDocenteRepository centroRepository;

    // Inyección por constructor: La mejor práctica para testing y seguridad
    public CentroDocenteServiceImpl(CentroDocenteRepository centroRepository) {
        this.centroRepository = centroRepository;
    }

    // 1. GESTIÓN (REEMPLAZA AL GUARDAR/ACTUALIZAR GENÉRICO)
    @Override
    @Transactional
    public CentroDocente guardar(CentroDocente centro) {
        return centroRepository.save(centro);
    }

    @Override
    @Transactional
    public CentroDocente actualizar(String codCentro, CentroDocente centroActualizado) {
        return centroRepository.findByCodCentro(codCentro)
                .map(centro -> {
                    // Actualización manual campo a campo (Evita nulos accidentales)
                    centro.setNombre(centroActualizado.getNombre());
                    centro.setDireccion(centroActualizado.getDireccion());
                    centro.setLocalidad(centroActualizado.getLocalidad());
                    centro.setTelefono(centroActualizado.getTelefono());
                    centro.setCorreoInstitucional(centroActualizado.getCorreoInstitucional());
                    return centroRepository.save(centro);
                })
                .orElseThrow(() -> new RuntimeException("No existe el centro con código: " + codCentro));
    }

    @Override
    @Transactional
    public void eliminar(String codigoCentro) {
        if (!centroRepository.existsById(codigoCentro)) {
            throw new RuntimeException("No se puede eliminar: El centro no existe.");
        }
        centroRepository.deleteById(codigoCentro);
    }

    // 2. OBTENER POR CÓDIGO (EL "BUSCAR POR CÓDIGO" QUE YA TENÍAS)
    @Override
    @Transactional(readOnly = true)
    public Optional<CentroDocente> obtenerPorCodigo(String codCentro) {
        return centroRepository.findByCodCentro(codCentro);
    }

    // 3. ACCESO AL CENTRO PRINCIPAL (PARA TU CASO DE HIJO ÚNICO)
    @Override
    @Transactional(readOnly = true)
    public Optional<CentroDocente> obtenerCentroPrincipal() {
        // Simplemente cogemos el primer centro que exista en la tabla
        return centroRepository.findAll().stream().findFirst();
    }

    // 4. BÚSQUEDA POR CORREO (EL QUE DEJAMOS PARA VALIDACIONES)
    @Override
    @Transactional(readOnly = true)
    public Optional<CentroDocente> buscarPorCorreo(String correo) {
        return centroRepository.findByCorreoInstitucional(correo);
    }

    // 5. CENTRO DE UN ALUMNO (LLAMANDO A TU NATIVE QUERY)
    @Override
    @Transactional(readOnly = true)
    public Optional<CentroDocente> obtenerCentroDeAlumno(String idAlumno) {
        return centroRepository.findCentroByAlumnoId(idAlumno);
    }
}
