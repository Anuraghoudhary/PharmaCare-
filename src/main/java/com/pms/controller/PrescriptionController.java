package com.pms.controller;

import com.pms.model.Customer;
import com.pms.model.Prescription;
import com.pms.repository.CustomerRepository;
import com.pms.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PrescriptionController {

    private final PrescriptionRepository prescriptionRepository;
    private final CustomerRepository customerRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPrescription(@RequestBody Prescription request) {
        if (request.getCustomer() != null && request.getCustomer().getId() != null) {
            Customer customer = customerRepository.findById(request.getCustomer().getId()).orElse(null);
            request.setCustomer(customer);
        }
        
        // Simulating the OCR data extraction on the backend
        if (request.getExtractedText() == null || request.getExtractedText().isEmpty()) {
            request.setExtractedText("Simulated OCR Extraction: Detected [Paracetamol, Amoxicillin]. Verification required.");
        }
        
        Prescription saved = prescriptionRepository.save(request);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Prescription>> getCustomerPrescriptions(@PathVariable Long customerId) {
        return ResponseEntity.ok(prescriptionRepository.findByCustomerIdOrderByUploadedDateDesc(customerId));
    }
}
