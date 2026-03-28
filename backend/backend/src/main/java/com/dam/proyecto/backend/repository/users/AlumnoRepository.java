package com.dam.proyecto.backend.repository.users;

import com.dam.proyecto.backend.model.enums.RolUsuario;
import com.dam.proyecto.backend.model.users.Alumno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AlumnoRepository extends JpaRepository<Alumno, String> {

    @Query("SELECT a FROM Alumno a WHERE a.email = :email")
    Optional<Alumno> findByEmail(@Param("email") String email);

    Optional<Alumno> findByEmailAndRol(String email, RolUsuario rol);

    // Ajustado para que coincida con el atributo de la clase CentroDocente
    @Query("SELECT a FROM Alumno a WHERE a.centro.id = :codigoCentro")
    List<Alumno> findByCentroCodigoCentro(@Param("codigoCentro") String codigoCentro);

    @Query("SELECT a FROM Alumno a WHERE a.profesor.id = :idProfesor")
    List<Alumno> findByProfesorId(@Param("idProfesor") String idProfesor);

    @Query("SELECT a FROM Alumno a WHERE a.empresa.cif = :cif")
    List<Alumno> findByEmpresaCif(@Param("cif") String cif);

    @Query("SELECT a FROM Alumno a WHERE a.tutorEmpresa.id = :idTutor")
    List<Alumno> findByTutorEmpresaId(@Param("idTutor") String idTutor);

    // Mantenemos este automático porque es simple
    List<Alumno> findByProfesorIsNull();
}
/*public interface AlumnoRepository extends JpaRepository<Alumno, String> {

    // 1. BUSCAR PARA EL LOGIN (Igual que en profesores)
    Optional<Alumno> findByEmail(String email);

    // 2. LISTAR POR CENTRO (Para que el Gestor vea a TODOS sus alumnos)
    @Query("SELECT a FROM Alumno a WHERE a.centro.id = :codigoCentro")
    List<Alumno> findByCentroCodigoCentro(@Param("codigoCentro") String codigoCentro);

    // 3. LISTAR POR PROFESOR TUTOR (Para que el profesor vea solo a sus alumnos asignados)
    @Query("SELECT a FROM Alumno a WHERE a.profesor.id = :idProfesor")
    List<Alumno> findByProfesorId(@Param("idProfesor") String idProfesor);

    // 4. LISTAR POR EMPRESA (Para saber qué alumnos hay en cada sitio)
    List<Alumno> findByEmpresaCif(String cif);

    // 5. LISTAR POR TUTOR DE EMPRESA
    @Query("SELECT a FROM Alumno a WHERE a.tutorEmpresa.id = :idTutor")
    List<Alumno> findByTutorEmpresaId(@Param("idTutor") String idTutor);

    // 6. BUSCAR ALUMNOS SIN TUTOR ASIGNADO (Muy útil para el Gestor)
    List<Alumno> findByProfesorIsNull();
}*/