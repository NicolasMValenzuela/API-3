package com.uade.tpo.demo.controllers;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.uade.tpo.demo.entity.Vehiculo;
import com.uade.tpo.demo.service.VehicleService;

@RestController
@RequestMapping("/vehicles")
public class VehicleController {
    
    @Autowired
    private VehicleService vehicleService;

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
public ResponseEntity<?> createVehicle(
        @RequestPart("vehicle") String vehicleJson,
        @RequestPart(value = "image", required = false) MultipartFile image) {
    try {
        // Convertir JSON a Vehiculo
        com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();
        Vehiculo vehicle = objectMapper.readValue(vehicleJson, Vehiculo.class);

        // Procesar imagen
        if (image != null && !image.isEmpty()) {
            vehicle.setImagen(image.getBytes());
        }

        Vehiculo savedVehicle = vehicleService.saveVehicle(vehicle);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedVehicle);

    } catch (RuntimeException ex) {
        if ("duplicate_chasis".equals(ex.getMessage())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                java.util.Map.of("message", "El número de chasis ya está registrado")
            );
        }
        if ("duplicate_motor".equals(ex.getMessage())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                java.util.Map.of("message", "El número de motor ya está registrado")
            );
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            java.util.Map.of("message", ex.getMessage())
        );

    } catch (IOException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            java.util.Map.of("message", "Error al procesar la imagen")
        );

    } catch (Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            java.util.Map.of("message", "Error inesperado al crear el vehículo")
        );
    }
}
    @GetMapping
    public List<Vehiculo> getAllVehicles() {
        return vehicleService.getAllVehicles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehiculo> getVehicleById(@PathVariable Long id) {
        return vehicleService.getVehicleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Obtener la imagen de un vehículo
    @GetMapping("/{id}/image")
    public ResponseEntity<String> getVehicleImage(@PathVariable Long id) {
        return vehicleService.getVehicleById(id)
                .filter(v -> v.getImagen() != null)
                .map(v -> ResponseEntity.ok(Base64.getEncoder().encodeToString(v.getImagen())))
                .orElse(ResponseEntity.notFound().build());
    }

    // Actualizar la imagen de un vehículo
    @PutMapping("/{id}/image")
    public ResponseEntity<?> updateVehicleImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile image) {
        try {
            Vehiculo updatedVehicle = vehicleService.updateVehicleImage(id, image);
            // Devolver la imagen en base64 en el objeto
            if (updatedVehicle.getImagen() != null) {
                String imagenBase64 = Base64.getEncoder().encodeToString(updatedVehicle.getImagen());
                // Crear un DTO para devolver la imagen junto con otros datos
                var response = new java.util.HashMap<String, Object>();
                response.put("idVehiculo", updatedVehicle.getIdVehiculo());
                response.put("id", updatedVehicle.getIdVehiculo());
                response.put("imageUrl", "data:image/jpeg;base64," + imagenBase64);
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.ok(updatedVehicle);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
public ResponseEntity<?> updateVehicle(@PathVariable Long id, @RequestBody Vehiculo vehicle) {
    return vehicleService.getVehicleById(id).map(existing -> {
        vehicle.setIdVehiculo(id);
        // Preservar la imagen actual si no se proporciona una nueva
        vehicle.setImagen(existing.getImagen());
        try {
            Vehiculo updatedVehicle = vehicleService.saveVehicle(vehicle);
            return ResponseEntity.ok(updatedVehicle);
        } catch (RuntimeException ex) {
            if (ex.getMessage().equals("duplicate_chasis")) {
                return ResponseEntity.status(409).body(
                    java.util.Map.of("message", "El número de chasis ya está registrado")
                );
            }
            if (ex.getMessage().equals("duplicate_motor")) {
                return ResponseEntity.status(409).body(
                    java.util.Map.of("message", "El número de motor ya está registrado")
                );
            }
            return ResponseEntity.badRequest().body(java.util.Map.of("message", ex.getMessage()));
        }
    }).orElse(ResponseEntity.notFound().build());
}



    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        if (vehicleService.getVehicleById(id).isPresent()) {
            vehicleService.deleteVehicle(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}