package com.inventario.backend.controller;

import com.inventario.backend.model.Referencia;
import com.inventario.backend.service.ReferenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/referencias")
@CrossOrigin(origins = "*") 
public class ReferenciaController {

    @Autowired
    private ReferenciaService referenciaService;

    // --- 1. Registrar Referencia ---
    // POST /api/referencias/registrar
    @PostMapping("/registrar") 
    public ResponseEntity<?> registrarReferencia(@RequestBody Referencia referencia) {
        try {
            Referencia nuevaReferencia = referenciaService.registrarReferencia(referencia);
            return new ResponseEntity<>(nuevaReferencia, HttpStatus.CREATED); 
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage()); 
        }
    }

    // --- 2. Consultar Referencia (Listado de ACTIVOS) ---
    // GET /api/referencias/listar
    @GetMapping("/listar") 
    public List<Referencia> listarReferenciasActivas() {
        return referenciaService.obtenerReferenciasActivas();
    }
    
    // --- 3. Obtener por ID ---
    // GET /api/referencias/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Referencia> obtenerReferenciaPorId(@PathVariable Long id) {
        Optional<Referencia> referencia = referenciaService.obtenerPorId(id); 
        return referencia.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build()); 
    }

    // --- 4. Editar Referencia (Incluye Reactivación) ---
    // PUT /api/referencias/editar/{id}
    @PutMapping("/editar/{id}") 
    public ResponseEntity<?> actualizarReferencia(@PathVariable Long id, @RequestBody Referencia referencia) {
        try {
            Referencia actualizada = referenciaService.actualizarReferencia(id, referencia);
            return new ResponseEntity<>(actualizada, HttpStatus.OK); 
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage()); 
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage()); 
        }
    }

    // --- 5. Eliminar Referencia (Desactivación Lógica) ---
    // DELETE /api/referencias/eliminar/{id}
    @DeleteMapping("/eliminar/{id}") 
    public ResponseEntity<?> desactivarReferencia(@PathVariable Long id) {
        try {
            Referencia desactivada = referenciaService.desactivarReferencia(id);
            return new ResponseEntity<>(desactivada, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage()); 
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage()); 
        }
    }
}