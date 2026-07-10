package com.payline.portal.service;

import com.payline.portal.entity.AuditLog;
import com.payline.portal.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

@Service
public class AuditService {

    private final AuditLogRepository repo;

    public AuditService(AuditLogRepository repo) {
        this.repo = repo;
    }

    public void log(String actorEmail, String action, String entityType, String entityId, String detail) {
        repo.save(new AuditLog(actorEmail, action, entityType, entityId, detail));
    }
}
