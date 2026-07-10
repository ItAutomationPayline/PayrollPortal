package com.payline.portal.entity;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * Metadata for a file that lives on disk (Windows server file storage).
 * The bytes are NOT stored in the DB - only the storage path + metadata.
 */
@Entity
@Table(name = "payroll_files")
public class PayrollFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "cycle_id", nullable = false)
    private PayrollCycle cycle;

    @Column(name = "original_name", nullable = false)
    private String originalName;

    /** Path on the Windows server file store. */
    @Column(name = "stored_path", nullable = false, length = 1024)
    private String storedPath;

    @Column(name = "content_type")
    private String contentType;

    @Column(name = "size_bytes")
    private long sizeBytes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private FileKind kind;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private FileStatus status = FileStatus.UPLOADED;

    @Column(name = "uploaded_by")
    private String uploadedBy;

    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private Instant uploadedAt = Instant.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PayrollCycle getCycle() { return cycle; }
    public void setCycle(PayrollCycle cycle) { this.cycle = cycle; }

    public String getOriginalName() { return originalName; }
    public void setOriginalName(String originalName) { this.originalName = originalName; }

    public String getStoredPath() { return storedPath; }
    public void setStoredPath(String storedPath) { this.storedPath = storedPath; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public long getSizeBytes() { return sizeBytes; }
    public void setSizeBytes(long sizeBytes) { this.sizeBytes = sizeBytes; }

    public FileKind getKind() { return kind; }
    public void setKind(FileKind kind) { this.kind = kind; }

    public FileStatus getStatus() { return status; }
    public void setStatus(FileStatus status) { this.status = status; }

    public String getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }

    public Instant getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(Instant uploadedAt) { this.uploadedAt = uploadedAt; }
}
