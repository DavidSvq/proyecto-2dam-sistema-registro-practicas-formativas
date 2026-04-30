package com.dam.proyecto.backend.dto.ia;

import lombok.Data;
import lombok.NoArgsConstructor;

// Este es el JSON que recibimos de Python
@Data
@NoArgsConstructor
public class PrediccionResponse {
    private Double horas_estimadas;
}