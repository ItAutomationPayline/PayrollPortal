package com.payline.portal.service;

import com.payline.portal.entity.*;
import com.payline.portal.repository.PayrollCycleRepository;
import com.payline.portal.repository.PayrollFileRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

/**
 * Stores uploaded bytes on the Windows server file store (path from app.storage.root),
 * and keeps only metadata in the database.
 */
@Service
public class FileStorageService {

    private final Path root;
    private final PayrollFileRepository files;
    private final PayrollCycleRepository cycles;
    private final AuditService audit;

    public FileStorageService(@Value("${app.storage.root}") String rootDir,
                              PayrollFileRepository files,
                              PayrollCycleRepository cycles,
                              AuditService audit) {
        this.root = Paths.get(rootDir).toAbsolutePath().normalize();
        this.files = files;
        this.cycles = cycles;
        this.audit = audit;
        try {
            Files.createDirectories(this.root);
        } catch (IOException e) {
            throw new IllegalStateException("Cannot create storage root: " + this.root, e);
        }
    }

    public PayrollFile store(Long cycleId, MultipartFile file, FileKind kind, String actor) {
        PayrollCycle cycle = cycles.findById(cycleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown cycleId"));

        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Empty file");
        }

        String original = Paths.get(file.getOriginalFilename() == null ? "upload" : file.getOriginalFilename())
                .getFileName().toString();
        String stored = UUID.randomUUID() + "_" + original;
        Path target = root.resolve(stored).normalize();

        if (!target.startsWith(root)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid path");
        }

        try {
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Store failed");
        }

        PayrollFile pf = new PayrollFile();
        pf.setCycle(cycle);
        pf.setOriginalName(original);
        pf.setStoredPath(target.toString());
        pf.setContentType(file.getContentType());
        pf.setSizeBytes(file.getSize());
        pf.setKind(kind);
        pf.setStatus(FileStatus.UPLOADED);
        pf.setUploadedBy(actor);
        files.save(pf);

        audit.log(actor, "UPLOAD_FILE", "PayrollFile", String.valueOf(pf.getId()),
                kind + " : " + original);
        return pf;
    }

    public Path resolveForDownload(PayrollFile pf) {
        Path p = Paths.get(pf.getStoredPath()).normalize();
        if (!Files.exists(p)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File missing on disk");
        }
        return p;
    }
}
