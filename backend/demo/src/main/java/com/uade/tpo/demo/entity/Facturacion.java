package com.uade.tpo.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "facturaciones")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Facturacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idFacturacion;

    private String razonSocial;
    private String direccionEnvio;
    private Integer cuit;

    @OneToOne
    @JoinColumn(name = "idPedido", nullable = false)
    private Pedido pedido;
}
