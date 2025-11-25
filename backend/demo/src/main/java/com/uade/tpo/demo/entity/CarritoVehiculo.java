package com.uade.tpo.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "carrito_vehiculo")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CarritoVehiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Float valor;

    @Builder.Default
    private Integer cantidad = 1;

    @ManyToOne
    @JoinColumn(name = "idCarrito", nullable = false)
    @JsonIgnore
    private Carrito carrito;

    @ManyToOne
    @JoinColumn(name = "idVehiculo", nullable = false)
    private Vehiculo vehiculo;
}

