package com.uade.tpo.demo.dto;

import com.uade.tpo.demo.entity.EstadoPedido;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
public class PedidoDTO {
    private Long idPedido;
    private LocalDateTime fechaDeCreacion;
    private Double costoTotal;
    private UserDTO cliente;
    private List<VehiculoDTO> vehiculos;
    private String formaDePago;
    private EstadoPedido estado;
}