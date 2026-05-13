package com.pms.service;

import com.pms.model.Medicine;
import com.pms.model.Sale;
import com.pms.model.SaleItem;
import com.pms.repository.MedicineRepository;
import com.pms.repository.SaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SaleService {

    private final SaleRepository saleRepository;
    private final MedicineRepository medicineRepository;

    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    public Sale getSaleById(Long id) {
        return saleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale not found"));
    }

    @Transactional
    public Sale createSale(Sale sale) {
        // Link sale items to the sale and reduce medicine stock
        for (SaleItem item : sale.getItems()) {
            item.setSale(sale);
            
            Medicine medicine = medicineRepository.findById(item.getMedicine().getId())
                    .orElseThrow(() -> new RuntimeException("Medicine not found"));
            
            if (medicine.getQuantity() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + medicine.getName());
            }
            
            medicine.setQuantity(medicine.getQuantity() - item.getQuantity());
            medicineRepository.save(medicine);
        }
        
        return saleRepository.save(sale);
    }
}
