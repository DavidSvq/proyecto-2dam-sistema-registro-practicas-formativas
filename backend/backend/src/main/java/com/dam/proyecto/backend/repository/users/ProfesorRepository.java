package com.dam.proyecto.backend.repository.users;

import com.dam.proyecto.backend.model.CentroDocente;
import com.dam.proyecto.backend.model.enums.RolDocente;
import com.dam.proyecto.backend.model.users.Profesor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface ProfesorRepository extends JpaRepository<Profesor, String> {

    // 1. LOGIN / SEGURIDAD
    // Buscamos por email para identificar quién intenta entrar (Gestor o Tutor)
    @Query("SELECT p FROM Profesor p WHERE p.email = :email")
    Optional<Profesor> findByEmail(@Param("email") String email);

    // 2. FILTRADO POR ROL Y CENTRO (LA LLAVE DEL GESTOR)
    // Para que un Gestor de 'CEN01' vea solo a los 'TUTOR' de su centro
    @Query("SELECT p FROM Profesor p WHERE p.centro.codCentro = :codCentro AND p.rol = :rol")
    List<Profesor> findByCentroAndRol(@Param("codCentro") String codCentro, @Param("rol") RolDocente rol);

    // 3. BUSCAR TODOS LOS DE UN CENTRO
    // Para que el Gestor vea a todo su personal docente
    @Query("SELECT p FROM Profesor p WHERE p.centro.codCentro = :codCentro")
    List<Profesor> findByCentro(@Param("codCentro") String codCentro);

    // 4. EL PROFESOR DE UN ALUMNO (NATIVE QUERY)
    // Crucial para que el Alumno sepa quién le tutoriza en el instituto
    @Query(value = "SELECT p.* FROM personal_docente p " +
            "JOIN alumnos a ON a.fk_profesor = p.codigo_docente " +
            "WHERE a.id_codigo_alumno = :idAlumno", nativeQuery = true)
    Optional<Profesor> findProfesorByAlumnoId(@Param("idAlumno") String idAlumno);

    // 5. CARGA DE TRABAJO
    // Para que el Gestor vea quién tiene pocos alumnos y pueda asignarle más
    List<Profesor> findByNumAlumnosLessThan(Integer limite);
}
