package com.uade.tpo.demo.controllers;

import com.uade.tpo.demo.entity.Pedido;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.dto.PedidoDTO;
import com.uade.tpo.demo.entity.EstadoPedido;
import com.uade.tpo.demo.service.PedidoService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping
    public ResponseEntity<List<PedidoDTO>> getAllPedidos() {
        return ResponseEntity.ok(pedidoService.getAllPedidos());
    }

    @GetMapping("/mis-pedidos")
    public ResponseEntity<List<PedidoDTO>> getMisPedidos(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        List<PedidoDTO> pedidos = pedidoService.getPedidosByClienteId(user.getIdCliente());
        return ResponseEntity.ok(pedidos);
    }

    // NUEVO ENDPOINT PARA ADMIN
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Pedido> updateEstadoPedido(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            EstadoPedido nuevoEstado = EstadoPedido.valueOf(body.get("estado"));
            Pedido pedidoActualizado = pedidoService.updatePedidoEstado(id, nuevoEstado);
            return ResponseEntity.ok(pedidoActualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}