package com.uade.tpo.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarritoVehiculoDTO {
    private Long id;
    private Double valor;
    private Long vehiculoId;
}
