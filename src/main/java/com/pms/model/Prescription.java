package com.pms.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "prescriptions")
@Data
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_url")
    private String fileUrl;

    @Column(name = "status")
    private String status = "Pending Verification";

    @Column(name = "extracted_text", columnDefinition = "TEXT")
    private String extractedText;

    @Column(name = "uploaded_date")
    private LocalDateTime uploadedDate;

    @PrePersist
    protected void onCreate() {
        if (uploadedDate == null) {
            uploadedDate = LocalDateTime.now();
        }
    }
}
