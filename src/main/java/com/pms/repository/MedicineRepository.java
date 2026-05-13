package com.pms.repository;

import com.pms.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    
    @Query("SELECT m FROM Medicine m WHERE m.quantity < 10")
    List<Medicine> findLowStockMedicines();
    
    @Query("SELECT m FROM Medicine m WHERE m.expiryDate < :date")
    List<Medicine> findExpiringMedicines(LocalDate date);

    @Query("SELECT m FROM Medicine m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(m.category) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(m.genericName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(m.uses) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Medicine> searchMedicines(String query);
}
