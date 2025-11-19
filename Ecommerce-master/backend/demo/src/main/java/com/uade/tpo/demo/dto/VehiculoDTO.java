package com.uade.tpo.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class VehiculoDTO {
    private Long idVehiculo;
    private String marca;
    private String modelo;
}