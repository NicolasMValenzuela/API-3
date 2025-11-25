package com.uade.tpo.demo.controllers;

import com.uade.tpo.demo.entity.Carrito;
import com.uade.tpo.demo.entity.CarritoVehiculo;
import com.uade.tpo.demo.dto.CarritoDTO;
import com.uade.tpo.demo.dto.CarritoVehiculoDTO;
import com.uade.tpo.demo.entity.Pedido;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.service.CarritoService;
import com.uade.tpo.demo.repository.FormaDePagoRepository;
import com.uade.tpo.demo.entity.FormaDePago;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map; // <-- Importante: importar Map

@RestController
@RequestMapping("/carritos")
@RequiredArgsConstructor
public class CarritoController {

    private final CarritoService carritoService;
    private final FormaDePagoRepository formaDePagoRepository;


    @PostMapping
    public ResponseEntity<CarritoDTO> createCarrito(@RequestBody Carrito carrito) {
        Carrito created = carritoService.createCarrito(carrito);
        CarritoDTO dto = mapToDto(created);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarritoDTO> getCarrito(@PathVariable Long id) {
        return carritoService.getCarritoById(id)
                .map(c -> ResponseEntity.ok(mapToDto(c)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/items")
    public ResponseEntity<CarritoDTO> addItem(@PathVariable Long id, @RequestBody CarritoVehiculo item) {
        Carrito updated = carritoService.addVehiculoToCarrito(id, item);
        return ResponseEntity.ok(mapToDto(updated));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> removeItem(@PathVariable Long itemId) {
        carritoService.removeItem(itemId);
        return ResponseEntity.noContent().build();
    }

    // --- MÉTODO CHECKOUT CORREGIDO ---
    @PostMapping("/{id}/checkout")
    public ResponseEntity<Pedido> checkout(@PathVariable Long id, @RequestBody Map<String, String> requestBody) {
        // 1. Extraemos el String "TARJETA", "EFECTIVO", etc., del cuerpo del JSON.
        String tipoDePagoStr = requestBody.get("formaDePago");
        if (tipoDePagoStr == null) {
            return ResponseEntity.badRequest().build(); // Si no envían la forma de pago, es un error.
        }

        // 2. Convertimos el String a nuestro tipo Enum.
        FormaDePago.TipoFormaDePago tipo = FormaDePago.TipoFormaDePago.valueOf(tipoDePagoStr);
        
        // 3. Buscamos la entidad FormaDePago en la base de datos o la creamos si no existe.
        FormaDePago formaPersist = formaDePagoRepository.findByFormaDePago(tipo)
            .orElseGet(() -> {
                FormaDePago nuevaForma = new FormaDePago();
                nuevaForma.setFormaDePago(tipo);
                return formaDePagoRepository.save(nuevaForma);
            });

        // 4. Llamamos al servicio con la entidad correcta.
        Pedido nuevoPedido = carritoService.confirmarCarritoYGenerarPedido(id, formaPersist);
        return ResponseEntity.ok(nuevoPedido);
    }

    private CarritoDTO mapToDto(Carrito c) {
        CarritoDTO dto = new CarritoDTO();
        dto.setIdCarrito(c.getIdCarrito());
        dto.setClienteId(c.getCliente() != null ? c.getCliente().getIdCliente() : null);
        if (c.getCarritoVehiculos() != null) {
            List<CarritoVehiculoDTO> items = new java.util.ArrayList<>();
            for (CarritoVehiculo iv : c.getCarritoVehiculos()) {
                CarritoVehiculoDTO ivd = new CarritoVehiculoDTO();
                ivd.setId(iv.getId());
                ivd.setValor(iv.getValor() != null ? iv.getValor().doubleValue() : null);
                ivd.setVehiculoId(iv.getVehiculo() != null ? iv.getVehiculo().getIdVehiculo() : null);
                items.add(ivd);
            }
            dto.setItems(items);
        }
        return dto;
    }

    @GetMapping("/mine")
    public ResponseEntity<CarritoDTO> getMyCarrito(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Carrito carrito = carritoService.getOrCreateCarritoForUser(user);
        return ResponseEntity.ok(mapToDto(carrito));
    }
}