package com.uade.tpo.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pedido_configuracion")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PedidoConfiguracion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "idPedido", nullable = false)
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "idConfiguracion", nullable = false)
    private ConfiguracionAdicional configuracion;

    @Builder.Default
    private String estado = "PENDIENTE_PAGO"; 
}
