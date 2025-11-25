package com.uade.tpo.demo.entity;

import com.uade.tpo.demo.categories.Category;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vehiculos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vehiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_vehiculo")
    private Long idVehiculo;

    private String marca;
    private String modelo;
    private String color;

    @Column(name = "numero_chasis", unique = true, nullable = false)
    private Integer numeroChasis;

    @Column(name = "numero_motor", unique = true, nullable = false)
    private Integer numeroMotor;

    @Column(name = "precio_base")
    private Float precioBase;

    @Column(name = "stock", nullable = false)
    private Integer stock;

    @Lob
    @Column(name = "imagen", columnDefinition = "LONGBLOB")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private byte[] imagen;

    // 🔹 Relación con Category
    @ManyToOne(fetch = FetchType.EAGER) 
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "anio")
    private Integer anio;

    @Column(name = "kilometraje")
    private Integer kilometraje;
}
