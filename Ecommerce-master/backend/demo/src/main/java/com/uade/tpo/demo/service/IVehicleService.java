package com.uade.tpo.demo.service;

import java.util.List;
import java.util.Optional;

import com.uade.tpo.demo.entity.Vehiculo;

public interface IVehicleService {
    public Vehiculo saveVehicle(Vehiculo vehicle);
    public List<Vehiculo> getAllVehicles();
    public Optional<Vehiculo> getVehicleById(Long id);
    public void deleteVehicle(Long id);

}
