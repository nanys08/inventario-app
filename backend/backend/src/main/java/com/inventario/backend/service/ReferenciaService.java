package com.inventario.backend.service;

import com.inventario.backend.model.Referencia;
import com.inventario.backend.repository.ReferenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReferenciaService {

    @Autowired
    private ReferenciaRepository referenciaRepository;

    // --- Registrar Referencia (POST /registrar) ---
    public Referencia registrarReferencia(Referencia referencia) {
        if (referenciaRepository.existsByCodReferencia(referencia.getCodReferencia())) {
            throw new IllegalArgumentException("El código de referencia ya está registrado: " + referencia.getCodReferencia());
        }
        // Por defecto, una nueva referencia se registra como activa (true)
        referencia.setEstadoReferencia(true);
        return referenciaRepository.save(referencia);
    }

    // --- Obtener Referencias Activas (GET /listar) ---
    public List<Referencia> obtenerReferenciasActivas() {
        // Asumiendo que ReferenciaRepository.findByEstadoReferencia(true) existe.
        return referenciaRepository.findByEstadoReferencia(true);
    }
    
    // --- Obtener por ID (GET /{id}) ---
    public Optional<Referencia> obtenerPorId(Long id) {
        return referenciaRepository.findById(id);
    }

    // --- Actualizar Referencia (PUT /editar/{id}) ---
    // Permite la reactivación al actualizar el estadoReferencia.
    public Referencia actualizarReferencia(Long id, Referencia referencia) {
        Referencia referenciaExistente = referenciaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Referencia no encontrada con ID: " + id));

        // 1. Validar unicidad para el código de referencia (si cambia)
        if (!referencia.getCodReferencia().equals(referenciaExistente.getCodReferencia())) {
            if (referenciaRepository.existsByCodReferencia(referencia.getCodReferencia())) {
                throw new IllegalArgumentException("El código de referencia ya está registrado: " + referencia.getCodReferencia());
            }
        }
        
        // 2. Copiar los datos (incluyendo el estado)
        referenciaExistente.setCodReferencia(referencia.getCodReferencia());
        referenciaExistente.setNombreReferencia(referencia.getNombreReferencia());
        
        // Permite la reactivación o desactivación manual por el PUT del administrador.
        referenciaExistente.setEstadoReferencia(referencia.getEstadoReferencia()); 

        return referenciaRepository.save(referenciaExistente);
    }

    // --- Desactivación Lógica (DELETE /eliminar/{id}) ---
    public Referencia desactivarReferencia(Long id) {
        Referencia referenciaExistente = referenciaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Referencia no encontrada con ID: " + id));
        
        if (!referenciaExistente.getEstadoReferencia()) {
             throw new IllegalStateException("La referencia con ID " + id + " ya está inactiva.");
        }

        referenciaExistente.setEstadoReferencia(false);
        return referenciaRepository.save(referenciaExistente);
    }
}