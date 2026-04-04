package com.dam.proyecto.backend.dto.login;

import com.dam.proyecto.backend.model.enums.RolUsuario;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO utilizado para enviar las credenciales de un usuario al backend
 * con el fin de validar su acceso al sistema.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequestDTO {

    /**
     * Correo electrónico del usuario.
     */
    private String email;

    /**
     * Contraseña asociada a la cuenta del usuario.
     */
    private String password;

    /**
     * Rol con el que el usuario intenta autenticarse (ALUMNO, PROFESOR, TUTOR_EMPRESA).
     */
    private RolUsuario rol; // Se puede cambiar a Enum si ya tienes definido RolUsuario
}