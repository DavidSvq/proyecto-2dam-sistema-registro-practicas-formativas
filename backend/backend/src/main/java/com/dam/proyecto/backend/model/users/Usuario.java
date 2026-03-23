package com.dam.proyecto.backend.model.users;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@MappedSuperclass // No crea tabla propia, sus campos se integran en las tablas hijas
public abstract class Usuario {

    @Id
    // Nota: No usamos GeneratedValue porque tus tablas usan VARCHAR(20) como PK manual
    private String id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String apellidos;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    // Métodos de lógica (se implementarán en el Service)
    public abstract void login(String email, String password);
    public abstract void recuperarPassword(String email);
}