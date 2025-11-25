package com.uade.tpo.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "forma_de_pago")
public class FormaDePago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idFormaDePago;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoFormaDePago formaDePago;

    public enum TipoFormaDePago {
        EFECTIVO,
        TARJETA,
        TRANSFERENCIA
    }
}

