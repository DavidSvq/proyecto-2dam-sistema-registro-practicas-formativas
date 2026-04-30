package com.dam.proyecto.backend.service.external;

import com.dam.proyecto.backend.dto.ia.PrediccionRequest;
import com.dam.proyecto.backend.dto.ia.PrediccionResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class IARestClient {

    private final RestTemplate restTemplate;

    // URL de tu FastAPI (en el futuro esto irá al application.properties)
    private final String IA_URL = "http://localhost:8000/predict";

    public Double obtenerPrediccionHoras(String descripcion) {
        try {
            // 1. Preparamos el paquete (Request)
            PrediccionRequest request = new PrediccionRequest(descripcion);

            // 2. Enviamos el POST y recibimos la respuesta
            log.info("Enviando descripción a FastAPI para predicción...");
            PrediccionResponse response = restTemplate.postForObject(IA_URL, request, PrediccionResponse.class);

            if (response != null && response.getHoras_estimadas() != null) {
                log.info("Predicción recibida con éxito: {} horas", response.getHoras_estimadas());
                return response.getHoras_estimadas();
            }
        } catch (Exception e) {
            log.error("Error conectando con el motor de IA: {}. Se usará valor por defecto (0.0)", e.getMessage());
        }

        return 0.0; // Valor seguro por si la IA está apagada o falla
    }
}
