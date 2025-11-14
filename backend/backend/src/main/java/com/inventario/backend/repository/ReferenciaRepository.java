package com.inventario.backend.repository;

import com.inventario.backend.model.Referencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReferenciaRepository extends JpaRepository<Referencia, Long> {

    // 1. Usado para validar que el código de referencia no se repita al registrar o editar.
    boolean existsByCodReferencia(String codReferencia);
    
    // 2. Usado para obtener el listado de referencias activas (estadoReferencia = true).
    List<Referencia> findByEstadoReferencia(boolean estadoReferencia);
}