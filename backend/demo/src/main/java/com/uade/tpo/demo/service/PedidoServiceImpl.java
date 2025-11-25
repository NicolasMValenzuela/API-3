package com.uade.tpo.demo.service;

import com.uade.tpo.demo.dto.PedidoDTO;
import com.uade.tpo.demo.dto.UserDTO;
import com.uade.tpo.demo.dto.VehiculoDTO;
import com.uade.tpo.demo.entity.EstadoPedido;
import com.uade.tpo.demo.entity.Pedido;
import com.uade.tpo.demo.repository.PedidoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepository;

    public PedidoServiceImpl(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    private PedidoDTO convertToDto(Pedido pedido) {
        PedidoDTO dto = new PedidoDTO();
        dto.setIdPedido(pedido.getIdPedido());
        dto.setFechaDeCreacion(pedido.getFechaDeCreacion());
        dto.setCostoTotal(pedido.getCostoTotal());
        dto.setEstado(pedido.getEstado());
        dto.setFormaDePago(pedido.getFormaDePago().getFormaDePago().name());

        UserDTO userDto = new UserDTO();
        userDto.setIdCliente(pedido.getCliente().getIdCliente());
        userDto.setUsername(pedido.getCliente().getUsername());
        userDto.setFirstName(pedido.getCliente().getFirstName());
        userDto.setLastName(pedido.getCliente().getLastName());
        dto.setCliente(userDto);

        List<VehiculoDTO> vehiculoDtos = pedido.getVehiculos().stream().map(v -> {
            VehiculoDTO vDto = new VehiculoDTO();
            vDto.setIdVehiculo(v.getIdVehiculo());
            vDto.setMarca(v.getMarca());
            vDto.setModelo(v.getModelo());
            return vDto;
        }).collect(Collectors.toList());
        dto.setVehiculos(vehiculoDtos);

        return dto;
    }

    @Override
    public Pedido createPedido(Pedido pedido) {
        pedido.setFechaDeCreacion(LocalDateTime.now());
        return pedidoRepository.save(pedido);
    }

    @Override
    public List<PedidoDTO> getAllPedidos() {
        return pedidoRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Pedido> getPedidoById(Long id) {
        return pedidoRepository.findById(id);
    }

    @Override
    public Pedido updatePedido(Long id, Pedido pedidoDetails) {
        Pedido pedido = pedidoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pedido not found"));
        pedido.setCostoTotal(pedidoDetails.getCostoTotal());
        pedido.setCliente(pedidoDetails.getCliente());
        pedido.setVehiculos(pedidoDetails.getVehiculos());
        pedido.setFormaDePago(pedidoDetails.getFormaDePago());
        return pedidoRepository.save(pedido);
    }

    @Override
    public void deletePedido(Long id) {
        pedidoRepository.deleteById(id);
    }

    @Override
    public Pedido updatePedidoEstado(Long id, EstadoPedido estado) {
        Pedido pedido = pedidoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        pedido.setEstado(estado);
        return pedidoRepository.save(pedido);
    }

    @Override
    public List<PedidoDTO> getPedidosByClienteId(Long clienteId) {
        return pedidoRepository.findByClienteIdCliente(clienteId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
}