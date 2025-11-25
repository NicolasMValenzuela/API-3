package com.uade.tpo.demo.service;

import com.uade.tpo.demo.dto.PedidoDTO;
import com.uade.tpo.demo.entity.EstadoPedido;
import com.uade.tpo.demo.entity.Pedido;

import java.util.List;
import java.util.Optional;

public interface PedidoService {
    Pedido createPedido(Pedido pedido);
    Optional<Pedido> getPedidoById(Long id);
    Pedido updatePedido(Long id, Pedido pedidoDetails);
    void deletePedido(Long id);
    List<PedidoDTO> getAllPedidos();
    List<PedidoDTO> getPedidosByClienteId(Long clienteId);
    Pedido updatePedidoEstado(Long id, EstadoPedido estado);
}
