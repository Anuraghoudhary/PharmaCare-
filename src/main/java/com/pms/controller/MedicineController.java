package com.pms.controller;

import com.pms.model.Medicine;
import com.pms.service.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow frontend to call APIs
public class MedicineController {

    private final MedicineService medicineService;

    @GetMapping
    public List<Medicine> getAllMedicines() {
        return medicineService.getAllMedicines();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medicine> getMedicineById(@PathVariable Long id) {
        return ResponseEntity.ok(medicineService.getMedicineById(id));
    }

    @PostMapping
    public Medicine addMedicine(@RequestBody Medicine medicine) {
        return medicineService.saveMedicine(medicine);
    }

    @PutMapping("/{id}")
    public Medicine updateMedicine(@PathVariable Long id, @RequestBody Medicine medicineDetails) {
        Medicine existing = medicineService.getMedicineById(id);
        existing.setName(medicineDetails.getName());
        existing.setCategory(medicineDetails.getCategory());
        existing.setDescription(medicineDetails.getDescription());
        existing.setQuantity(medicineDetails.getQuantity());
        existing.setPrice(medicineDetails.getPrice());
        existing.setCostPrice(medicineDetails.getCostPrice());
        existing.setExpiryDate(medicineDetails.getExpiryDate());
        if(medicineDetails.getSupplier() != null && medicineDetails.getSupplier().getId() != null) {
            existing.setSupplier(medicineDetails.getSupplier());
        }
        return medicineService.saveMedicine(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicine(@PathVariable Long id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/low-stock")
    public List<Medicine> getLowStock() {
        return medicineService.getLowStockMedicines();
    }

    @GetMapping("/expiring")
    public List<Medicine> getExpiring() {
        return medicineService.getExpiringMedicines();
    }

    @GetMapping("/search")
    public List<Medicine> searchMedicines(@RequestParam String query) {
        return medicineService.searchMedicines(query);
    }
}
