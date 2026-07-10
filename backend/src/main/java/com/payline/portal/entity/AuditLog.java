package com.payline.portal.entity;

import jakarta.persistence.*;
import java.time.Instant;

/** Append-only audit trail. Rows are inserted, never updated or deleted. */
@Entity
@Table(name = "audit_log", indexes = @Index(name = "idx_audit_created", columnList = "created_at"))
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "actor_email")
    private String actorEmail;

    @Column(nullable = false, length = 64)
    private String action;

    @Column(name = "entity_type", length = 64)
    private String entityType;

    @Column(name = "entity_id")
    private String entityId;

    @Column(length = 1024)
    private String detail;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public AuditLog() {}

    public AuditLog(String actorEmail, String action, String entityType, String entityId, String detail) {
        this.actorEmail = actorEmail;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.detail = detail;
    }

    public Long getId() { return id; }
    public String getActorEmail() { return actorEmail; }
    public String getAction() { return action; }
    public String getEntityType() { return entityType; }
    public String getEntityId() { return entityId; }
    public String getDetail() { return detail; }
    public Instant getCreatedAt() { return createdAt; }
}
