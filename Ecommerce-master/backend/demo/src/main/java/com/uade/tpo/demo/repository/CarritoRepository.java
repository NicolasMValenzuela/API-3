package com.uade.tpo.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.uade.tpo.demo.entity.Carrito;
import java.util.Optional;

@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Long> {
	// Load carrito with its items and the associated vehiculo in one query
	@Query("select c from Carrito c left join fetch c.carritoVehiculos iv left join fetch iv.vehiculo where c.idCarrito = :id")
	Optional<Carrito> findByIdWithItems(@Param("id") Long id);
	Optional<Carrito> findByClienteIdClienteAndEstado(Long clienteId, String estado);
}
