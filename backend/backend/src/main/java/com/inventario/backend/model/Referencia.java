package com.inventario.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "referencia")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Referencia {

    // Mapeado a idReferencia SERIAL PRIMARY KEY
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idreferencia") // Asegura el mapeo correcto
    private Long idReferencia; 

    @Column(name = "codreferencia", nullable = false, unique = true, length = 20)
    private String codReferencia;

    @Column(name = "nombrereferencia", nullable = false, unique = true, length = 100)
    private String nombreReferencia;

    // Mapeado a estadoReferencia BOOLEAN NOT NULL DEFAULT TRUE
    @Column(name = "estadoreferencia", nullable = false)
    private Boolean estadoReferencia = true; 
}