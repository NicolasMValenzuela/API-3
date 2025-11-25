package com.uade.tpo.demo.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.uade.tpo.demo.categories.Category;
import com.uade.tpo.demo.categories.CategoryRepository;
import com.uade.tpo.demo.entity.Vehiculo;
import com.uade.tpo.demo.repository.VehicleRepository;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final CategoryRepository categoryRepository;

    public VehicleService(VehicleRepository vehicleRepository, CategoryRepository categoryRepository) {
        this.vehicleRepository = vehicleRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Vehiculo> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Optional<Vehiculo> getVehicleById(Long id) {
        return vehicleRepository.findById(id);
    }

    public Vehiculo saveVehicle(Vehiculo vehicle) {

        // Validar categoría
        if (vehicle.getCategory() != null && vehicle.getCategory().getId() != null) {
            Category category = categoryRepository.findById(vehicle.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada con id " + vehicle.getCategory().getId()));
            vehicle.setCategory(category);
        }

        // Validación de chasis único
        if (vehicle.getNumeroChasis() != null) {
            Optional<Vehiculo> existing = vehicleRepository.findByNumeroChasis(vehicle.getNumeroChasis());
            if (existing.isPresent() && !existing.get().getIdVehiculo().equals(vehicle.getIdVehiculo())) {
                throw new RuntimeException("duplicate_chasis");
            }
        }

        // Validación de motor único
        if (vehicle.getNumeroMotor() != null) {
            Optional<Vehiculo> existing = vehicleRepository.findByNumeroMotor(vehicle.getNumeroMotor());
            if (existing.isPresent() && !existing.get().getIdVehiculo().equals(vehicle.getIdVehiculo())) {
                throw new RuntimeException("duplicate_motor");
            }
        }

        return vehicleRepository.save(vehicle);
    }

    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }

    @Transactional
    public Vehiculo updateVehicleImage(Long id, MultipartFile image) throws IOException {
        Vehiculo vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehiculo no encontrado con id " + id));

        vehicle.setImagen(image.getBytes());
        return vehicleRepository.save(vehicle);
    }
}
