package com.dam.proyecto.backend.dto.ia;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Este es el JSON que enviamos a Python
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PrediccionRequest {
    private String descripcion_completa;
}
