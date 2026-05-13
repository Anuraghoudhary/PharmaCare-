package com.pms.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sales")
@Data
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Customer customer;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    private Double discount;

    @Column(name = "sale_date", nullable = false)
    private LocalDateTime saleDate;

    @Column(name = "is_delivery")
    private Boolean isDelivery = false;

    @Column(name = "delivery_address")
    private String deliveryAddress;

    @Column(name = "delivery_date")
    private java.time.LocalDate deliveryDate;

    @Column(name = "delivery_time")
    private String deliveryTime;

    @Column(name = "is_emergency_delivery")
    private Boolean isEmergencyDelivery = false;

    @Column(name = "delivery_status")
    private String deliveryStatus = "Pending";

    @Column(name = "delivery_fee")
    private Double deliveryFee = 0.0;

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<SaleItem> items = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (saleDate == null) {
            saleDate = LocalDateTime.now();
        }
    }
}
