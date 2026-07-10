package com.payline.portal.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "payroll_cycles")
public class PayrollCycle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    /** e.g. "2024-10" (payroll month). */
    @Column(name = "period_month", nullable = false, length = 7)
    private String periodMonth;

    /** True for off-cycle runs raised within the same month. */
    @Column(name = "off_cycle", nullable = false)
    private boolean offCycle = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private CycleStatus status = CycleStatus.MONTH_OPEN;

    /** Increments each time the client rejects and processing restarts. */
    @Column(name = "reject_count", nullable = false)
    private int rejectCount = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }

    public String getPeriodMonth() { return periodMonth; }
    public void setPeriodMonth(String periodMonth) { this.periodMonth = periodMonth; }

    public boolean isOffCycle() { return offCycle; }
    public void setOffCycle(boolean offCycle) { this.offCycle = offCycle; }

    public CycleStatus getStatus() { return status; }
    public void setStatus(CycleStatus status) { this.status = status; }

    public int getRejectCount() { return rejectCount; }
    public void setRejectCount(int rejectCount) { this.rejectCount = rejectCount; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
