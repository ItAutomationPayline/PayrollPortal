package com.payline.portal.repository;

import com.payline.portal.entity.PayrollCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PayrollCycleRepository extends JpaRepository<PayrollCycle, Long> {
    List<PayrollCycle> findByClientIdOrderByCreatedAtDesc(Long clientId);
}
