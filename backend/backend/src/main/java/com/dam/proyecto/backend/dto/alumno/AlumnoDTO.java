package com.dam.proyecto.backend.dto.alumno;

import com.dam.proyecto.backend.dto.centro.CentroDocenteDTO;
import com.dam.proyecto.backend.dto.empresa.EmpresaDTO;
import com.dam.proyecto.backend.dto.profesor.ProfesorDTO;
import com.dam.proyecto.backend.dto.tutor.TutorEmpresaDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlumnoDTO {

    // Identificador único del alumno
    private String id;

    // Nombre del alumno
    private String nombre;

    // Apellidos del alumno
    private String apellidos;

    // Correo electrónico del alumno
    private String email;

    // Rol del alumno (siempre será "ALUMNO")
    private String rol;

    // Total de horas acumuladas por el alumno
    private Integer horasTotales;

    // Centro educativo al que pertenece el alumno
    private CentroDocenteDTO centro;

    // Empresa en la que el alumno realiza las prácticas
    private EmpresaDTO empresa;

    // Profesor asignado al alumno
    private ProfesorDTO profesor;

    // Tutor de empresa que supervisa al alumno
    private TutorEmpresaDTO tutorEmpresa;
}
