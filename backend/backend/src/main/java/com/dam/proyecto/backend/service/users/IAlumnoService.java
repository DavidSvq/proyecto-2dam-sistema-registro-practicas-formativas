package com.dam.proyecto.backend.service.users;

import com.dam.proyecto.backend.dto.alumno.AlumnoDTO;
import com.dam.proyecto.backend.dto.login.LoginResponseDTO;
import com.dam.proyecto.backend.model.enums.RolUsuario;
import com.dam.proyecto.backend.model.users.Alumno;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IAlumnoService {

    // --- GESTIÓN DEL GESTOR ---
    // El Gestor crea al alumno con su email y pass '1234'
    Alumno guardar(Alumno alumno);

    // El Gestor asigna o cambia de empresa/tutor al alumno
    Alumno actualizar(String idAlumno, Alumno alumno);

    // El Gestor puede eliminar a un alumno si se da de baja
    void eliminar(String idAlumno);


    // --- Login ---
    LoginResponseDTO login(String email, String password, RolUsuario rol);

    // --- Recuperar / actualizar contraseña ---
    void recuperarPassword(String email, String nuevaPassword);

    // --- BÚSQUEDAS CRÍTICAS ---
    //Optional<Alumno> findByEmail(String email);
    Optional<AlumnoDTO> obtenerPorId(String idAlumno);

    // Para que el Gestor vea a TODOS sus alumnos
    List<AlumnoDTO> listarPorCentro(String codCentro);

    // Para que el Gestor vea quién NO tiene tutor docente aún
    List<AlumnoDTO> listarHuerfanos();

    // Para que un Profesor vea solo a SUS alumnos
    List<AlumnoDTO> listarPorTutorDocente(String idProfesor);

    // Para que la Empresa vea a sus alumnos en prácticas
    List<AlumnoDTO> listarPorEmpresa(String cif);


    // --- LÓGICA DE HORAS ---
    // Para cuando el alumno rellene su diario, sumamos horas
    void registrarHoras(String idAlumno, int horasNuevas);
}