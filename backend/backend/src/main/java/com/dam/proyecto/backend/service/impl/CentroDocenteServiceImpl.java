package com.dam.proyecto.backend.service.impl;

import com.dam.proyecto.backend.model.CentroDocente;
import com.dam.proyecto.backend.repository.CentroDocenteRepository;
import com.dam.proyecto.backend.service.ICentroDocenteService;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service // Esta anotación es vital para que Spring "encuentre" este servicio
public class CentroDocenteServiceImpl implements ICentroDocenteService {

    // Inyectamos el repositorio (nuestro puente a la base de datos)
    private final CentroDocenteRepository centroRepository;

    // Usamos el constructor para la inyección (más limpio que @Autowired)
    public CentroDocenteServiceImpl(CentroDocenteRepository centroRepository) {
        this.centroRepository = centroRepository;
    }

    @Override
    public Optional<CentroDocente> buscarPorCodigo(String codCentro) {
        // Usamos el método que Spring Data JPA ya nos da por defecto
        return centroRepository.findById(codCentro);
    }

    @Override
    public CentroDocente guardarOActualizar(CentroDocente centro) {
        // .save() inserta si el ID no existe, o actualiza si ya existe en la BD
        return centroRepository.save(centro);
    }
}
