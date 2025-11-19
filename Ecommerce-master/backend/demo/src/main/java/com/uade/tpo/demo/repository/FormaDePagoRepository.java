package com.uade.tpo.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.uade.tpo.demo.entity.FormaDePago;

import java.util.Optional;

@Repository
public interface FormaDePagoRepository extends JpaRepository<FormaDePago, Long> {
    Optional<FormaDePago> findByFormaDePago(FormaDePago.TipoFormaDePago tipo);
}
