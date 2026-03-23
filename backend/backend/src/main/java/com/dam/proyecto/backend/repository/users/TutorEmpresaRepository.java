package com.dam.proyecto.backend.repository.users;

import com.dam.proyecto.backend.model.users.Alumno;
import com.dam.proyecto.backend.model.users.TutorEmpresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TutorEmpresaRepository extends JpaRepository<TutorEmpresa, String> {

    /**
     * MÉTODO PARA EL GESTOR:
     * Lista todos los tutores vinculados a una empresa específica.
     * Usamos el CIF porque es el referencedColumnName en tu entidad Empresa.
     */
    @Query("SELECT t FROM TutorEmpresa t WHERE t.empresa.cif = :cifEmpresa")
    List<TutorEmpresa> findByEmpresaCif(@Param("cifEmpresa") String cifEmpresa);

    /**
     * MÉTODO PARA EL TUTOR DE EMPRESA:
     * Obtiene la lista de alumnos asignados a un tutor específico.
     * Importante: Accedemos a 'id' que es el campo heredado de Usuario.
     */
    @Query("SELECT a FROM Alumno a WHERE a.tutorEmpresa.id = :idTutor")
    List<Alumno> findAlumnosAsignados(@Param("idTutor") String idTutor);

    /**
     * Búsqueda por email para la lógica de Login/Seguridad
     */
    @Query("SELECT t FROM TutorEmpresa t WHERE t.email = :email")
    Optional<TutorEmpresa> findByEmailManual(@Param("email") String email);
}
