package com.pms.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "purchases")
@Data
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Supplier supplier;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Column(name = "purchase_date", nullable = false)
    private LocalDateTime purchaseDate;

    private String notes;

    @PrePersist
    protected void onCreate() {
        if (purchaseDate == null) {
            purchaseDate = LocalDateTime.now();
        }
    }
}
