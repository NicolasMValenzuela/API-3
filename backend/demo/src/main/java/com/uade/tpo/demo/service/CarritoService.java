package com.uade.tpo.demo.service;

import com.uade.tpo.demo.entity.Carrito;
import com.uade.tpo.demo.entity.CarritoVehiculo;
import com.uade.tpo.demo.entity.FormaDePago;
import com.uade.tpo.demo.entity.Pedido;
import com.uade.tpo.demo.entity.User;

import java.util.List;
import java.util.Optional;

public interface CarritoService {
    Carrito createCarrito(Carrito carrito);
    Optional<Carrito> getCarritoById(Long id);
    List<Carrito> getAllCarritos();
    Carrito addVehiculoToCarrito(Long carritoId, CarritoVehiculo item);
    void removeItem(Long itemId);
    Pedido confirmarCarritoYGenerarPedido(Long carritoId, FormaDePago formaDePago);
    Carrito getOrCreateCarritoForUser(User user);
}
