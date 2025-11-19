package com.uade.tpo.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "configuraciones_adicionales")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConfiguracionAdicional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idConfiguracion;

    private String nombre;
    private String descripcion;
    private Float precio;
}
