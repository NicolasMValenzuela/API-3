package com.uade.tpo.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "carritos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Carrito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCarrito;

    @ManyToOne
    @JoinColumn(name = "idCliente", nullable = false)
    private User cliente;

    @OneToMany(mappedBy = "carrito", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CarritoVehiculo> carritoVehiculos;

    @Builder.Default
    @Column(nullable = false)
    private String estado = "ABIERTO";
}
