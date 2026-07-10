package com.payline.portal.repository;

import com.payline.portal.entity.PayrollFile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PayrollFileRepository extends JpaRepository<PayrollFile, Long> {
    List<PayrollFile> findByCycleIdOrderByUploadedAtDesc(Long cycleId);
    List<PayrollFile> findByCycleClientIdOrderByUploadedAtDesc(Long clientId);
}
