package com.pms.service;

import com.pms.repository.CustomerRepository;
import com.pms.repository.MedicineRepository;
import com.pms.repository.SaleRepository;
import com.pms.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final MedicineRepository medicineRepository;
    private final SaleRepository saleRepository;
    private final CustomerRepository customerRepository;
    private final SupplierRepository supplierRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalMedicines", medicineRepository.count());
        stats.put("lowStockMedicines", medicineRepository.findLowStockMedicines().size());
        stats.put("totalCustomers", customerRepository.count());
        stats.put("totalSuppliers", supplierRepository.count());

        // Calculate today's sales
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        
        var todaySales = saleRepository.findBySaleDateBetween(startOfDay, endOfDay);
        double todaysRevenue = todaySales.stream().mapToDouble(s -> s.getTotalAmount()).sum();
        
        stats.put("todaysSalesCount", todaySales.size());
        stats.put("todaysRevenue", todaysRevenue);

        return stats;
    }
}
