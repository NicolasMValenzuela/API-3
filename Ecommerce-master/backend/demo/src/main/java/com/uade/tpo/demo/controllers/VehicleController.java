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
    public ResponseEntity<Vehiculo> createVehicle(
            @RequestPart("vehicle") String vehicleJson,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            // Convertir el JSON string a objeto Vehiculo
            com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();
            Vehiculo vehicle = objectMapper.readValue(vehicleJson, Vehiculo.class);
            
            if (image != null && !image.isEmpty()) {
                vehicle.setImagen(image.getBytes());
            }
            Vehiculo savedVehicle = vehicleService.saveVehicle(vehicle);
            return new ResponseEntity<>(savedVehicle, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }    @GetMapping
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
    public ResponseEntity<Vehiculo> updateVehicleImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile image) {
        try {
            Vehiculo updatedVehicle = vehicleService.updateVehicleImage(id, image);
            return ResponseEntity.ok(updatedVehicle);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
public ResponseEntity<Vehiculo> updateVehicle(@PathVariable Long id, @RequestBody Vehiculo vehicleDetails) {
    return vehicleService.getVehicleById(id).map(vehicle -> {
        vehicle.setMarca(vehicleDetails.getMarca());
        vehicle.setModelo(vehicleDetails.getModelo());
        vehicle.setColor(vehicleDetails.getColor());
        vehicle.setAnio(vehicleDetails.getAnio());
        vehicle.setKilometraje(vehicleDetails.getKilometraje());
        vehicle.setPrecioBase(vehicleDetails.getPrecioBase());
        vehicle.setStock(vehicleDetails.getStock());
        vehicle.setCategory(vehicleDetails.getCategory());
        vehicle.setNumeroChasis(vehicleDetails.getNumeroChasis());
        vehicle.setNumeroMotor(vehicleDetails.getNumeroMotor());

        Vehiculo updatedVehicle = vehicleService.saveVehicle(vehicle);
        return ResponseEntity.ok(updatedVehicle);
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