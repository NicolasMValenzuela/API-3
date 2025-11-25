package com.uade.tpo.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.demo.entity.Vehiculo;

public interface VehicleRepository extends JpaRepository<Vehiculo, Long> {

    boolean existsByNumeroChasis(Integer numeroChasis);
    boolean existsByNumeroMotor(Integer numeroMotor);

    Optional<Vehiculo> findByNumeroChasis(Integer numeroChasis);
    Optional<Vehiculo> findByNumeroMotor(Integer numeroMotor);
}
