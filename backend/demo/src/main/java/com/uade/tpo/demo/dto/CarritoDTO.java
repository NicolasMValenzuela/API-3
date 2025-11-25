package com.uade.tpo.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarritoDTO {
    private Long idCarrito;
    private Long clienteId;
    private List<CarritoVehiculoDTO> items;
}
