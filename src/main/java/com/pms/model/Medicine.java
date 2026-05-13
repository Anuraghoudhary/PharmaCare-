package com.pms.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "medicines")
@Data
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String category;
    
    private String description;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double price;

    @Column(name = "cost_price")
    private Double costPrice;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    // Advanced fields
    @Column(name = "image_url")
    private String imageUrl;

    @Column(length = 1000)
    private String uses;

    @Column(name = "side_effects", length = 1000)
    private String sideEffects;

    private String manufacturer;

    @Column(name = "is_prescription_required")
    private Boolean isPrescriptionRequired = false;

    @Column(name = "generic_name")
    private String genericName;

    private Double rating = 0.0;
}
