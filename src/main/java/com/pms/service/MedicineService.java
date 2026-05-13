package com.pms.service;

import com.pms.model.Medicine;
import com.pms.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicineService {

    private final MedicineRepository medicineRepository;

    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    public Medicine getMedicineById(Long id) {
        return medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
    }

    public Medicine saveMedicine(Medicine medicine) {
        return medicineRepository.save(medicine);
    }

    public void deleteMedicine(Long id) {
        medicineRepository.deleteById(id);
    }

    public List<Medicine> getLowStockMedicines() {
        return medicineRepository.findLowStockMedicines();
    }

    public List<Medicine> getExpiringMedicines() {
        // Expiring within next 30 days
        return medicineRepository.findExpiringMedicines(LocalDate.now().plusDays(30));
    }

    public List<Medicine> searchMedicines(String query) {
        return medicineRepository.searchMedicines(query);
    }
}
