package com.uade.tpo.demo.service;

import com.uade.tpo.demo.entity.Carrito;
import com.uade.tpo.demo.entity.CarritoVehiculo;
import com.uade.tpo.demo.entity.EstadoPedido;
import com.uade.tpo.demo.entity.FormaDePago;
import com.uade.tpo.demo.entity.Pedido;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.entity.Vehiculo;
import com.uade.tpo.demo.repository.CarritoRepository;
import com.uade.tpo.demo.repository.CarritoVehiculoRepository;
import com.uade.tpo.demo.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.uade.tpo.demo.repository.VehicleRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CarritoServiceImpl implements CarritoService {

    private final CarritoRepository carritoRepository;
    private final CarritoVehiculoRepository itemRepository;
    private final PedidoRepository pedidoRepository;
    private final VehicleRepository vehicleRepository;

    @Override
    public Carrito createCarrito(Carrito carrito) {
        return carritoRepository.save(carrito);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Carrito> getCarritoById(Long id) {
        Optional<Carrito> opt = carritoRepository.findByIdWithItems(id);
        opt.ifPresent(c -> {
            if (c.getCarritoVehiculos() != null) {
                c.getCarritoVehiculos().size();
                c.getCarritoVehiculos().forEach(iv -> {
                    if (iv.getVehiculo() != null) {
                        iv.getVehiculo().getIdVehiculo();
                    }
                });
            }
            if (c.getCliente() != null) {
                c.getCliente().getIdCliente();
            }
        });
        return opt;
    }

    @Override
    public List<Carrito> getAllCarritos() {
        return carritoRepository.findAll();
    }

    @Override
    @Transactional
    public Carrito addVehiculoToCarrito(Long carritoId, CarritoVehiculo item) {
        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new RuntimeException("Carrito not found"));
        item.setCarrito(carrito);
        itemRepository.save(item);

        Carrito updated = carritoRepository.findByIdWithItems(carritoId).orElse(carrito);
        if (updated.getCarritoVehiculos() != null) {
            updated.getCarritoVehiculos().size();
            updated.getCarritoVehiculos().forEach(iv -> {
                if (iv.getVehiculo() != null) iv.getVehiculo().getIdVehiculo();
            });
        }
        if (updated.getCliente() != null) updated.getCliente().getIdCliente();
        return updated;
    }

    @Override
    public void removeItem(Long itemId) {
        itemRepository.deleteById(itemId);
    }

    @Transactional
    @Override
    public Pedido confirmarCarritoYGenerarPedido(Long carritoId, FormaDePago formaDePago) {
        Carrito carrito = carritoRepository.findByIdWithItems(carritoId)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));

        if ("CONFIRMADO".equals(carrito.getEstado())) {
            throw new RuntimeException("El carrito ya fue confirmado");
        }

        if (carrito.getCarritoVehiculos() == null || carrito.getCarritoVehiculos().isEmpty()) {
            throw new RuntimeException("El carrito está vacío, no se puede generar un pedido.");
        }

        for (CarritoVehiculo item : carrito.getCarritoVehiculos()) {
            Vehiculo vehiculo = item.getVehiculo();
            int cantidadPedida = item.getCantidad();

            if (vehiculo.getStock() < cantidadPedida) {
                throw new RuntimeException("No hay stock suficiente para el vehículo: " + vehiculo.getMarca() + " " + vehiculo.getModelo());
            }
            vehiculo.setStock(vehiculo.getStock() - cantidadPedida);
            vehicleRepository.save(vehiculo);
        }

        carrito.setEstado("CONFIRMADO");
        carritoRepository.save(carrito);

        double subtotal = carrito.getCarritoVehiculos().stream()
            .mapToDouble(item -> item.getValor() * item.getCantidad())
            .sum();
            
        double costoFinal = subtotal;
        switch (formaDePago.getFormaDePago()) {
            case EFECTIVO:
                costoFinal *= 0.90; 
                break;
            case TRANSFERENCIA:
                costoFinal *= 0.95;
                break;
            case TARJETA:
                break;
        }

        List<Vehiculo> vehiculosDelPedido = carrito.getCarritoVehiculos().stream()
            .map(CarritoVehiculo::getVehiculo)
            .collect(Collectors.toList());

        Pedido pedido = Pedido.builder()
            .cliente(carrito.getCliente())
            .vehiculos(vehiculosDelPedido)
            .costoTotal(costoFinal)
            .formaDePago(formaDePago)
            .fechaDeCreacion(LocalDateTime.now())
            .estado(EstadoPedido.PAGADO)
            .build();

        return pedidoRepository.save(pedido);
    }

    @Override
    @Transactional
    public Carrito getOrCreateCarritoForUser(User user) {
        return carritoRepository.findByClienteIdClienteAndEstado(user.getIdCliente(), "ABIERTO")
                .orElseGet(() -> {
                    Carrito newCarrito = Carrito.builder()
                            .cliente(user)
                            .estado("ABIERTO")
                            .build();
                    return carritoRepository.save(newCarrito);
                });
    }
}