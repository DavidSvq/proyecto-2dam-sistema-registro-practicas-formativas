package com.dam.proyecto.backend.service.impl;

import com.dam.proyecto.backend.dto.centro.CentroDocenteDTO;
import com.dam.proyecto.backend.dto.centro.CentroDocenteMapper;
import com.dam.proyecto.backend.model.CentroDocente;
import com.dam.proyecto.backend.repository.CentroDocenteRepository;
import com.dam.proyecto.backend.service.ICentroDocenteService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CentroDocenteServiceImpl implements ICentroDocenteService {

    private final CentroDocenteRepository centroRepository;
    private final CentroDocenteMapper centroDocenteMapper;
    // Inyección por constructor: La mejor práctica para testing y seguridad
    public CentroDocenteServiceImpl(CentroDocenteRepository centroRepository, CentroDocenteMapper centroDocenteMapper) {
        this.centroRepository = centroRepository;
        this.centroDocenteMapper = centroDocenteMapper;
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
    public Optional<CentroDocenteDTO> obtenerPorCodigo(String codCentro) {
        return centroRepository.findByCodCentro(codCentro)
                .map(centroDocenteMapper::convertirACentroDocenteDTO);
    }

    // 3. ACCESO AL CENTRO PRINCIPAL (PARA TU CASO DE HIJO ÚNICO)
    @Override
    @Transactional(readOnly = true)
    public Optional<CentroDocenteDTO> obtenerCentroPrincipal() {
        return centroRepository.findAll().stream()
                .findFirst()
                .map(centroDocenteMapper::convertirACentroDocenteDTO);
    }

    // 4. BÚSQUEDA POR CORREO (EL QUE DEJAMOS PARA VALIDACIONES)
    @Override
    @Transactional(readOnly = true)
    public Optional<CentroDocenteDTO> buscarPorCorreo(String correo) {
        return centroRepository.findByCorreoInstitucional(correo)
                .map(centroDocenteMapper::convertirACentroDocenteDTO);
    }

    // 5. CENTRO DE UN ALUMNO (DEVOLVER DTO)
    @Override
    @Transactional(readOnly = true)
    public Optional<CentroDocenteDTO> obtenerCentroDeAlumno(String idAlumno) {
        return centroRepository.findCentroByAlumnoId(idAlumno)
                .map(centroDocenteMapper::convertirACentroDocenteDTO);
    }
}
