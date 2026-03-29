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

    // Método para buscar un alumno por su ID (heredado de Usuario)
    Optional<Alumno> findById(String id);

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