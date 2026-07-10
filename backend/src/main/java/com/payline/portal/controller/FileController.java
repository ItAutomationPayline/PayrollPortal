package com.payline.portal.controller;

import com.payline.portal.dto.FileDto;
import com.payline.portal.entity.FileKind;
import com.payline.portal.entity.PayrollFile;
import com.payline.portal.repository.PayrollFileRepository;
import com.payline.portal.service.FileStorageService;
import org.springframework.core.io.PathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.time.format.DateTimeFormatter;
import java.time.ZoneId;
import java.util.List;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private static final DateTimeFormatter FMT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").withZone(ZoneId.systemDefault());

    private final FileStorageService storage;
    private final PayrollFileRepository files;

    public FileController(FileStorageService storage, PayrollFileRepository files) {
        this.storage = storage;
        this.files = files;
    }

    @GetMapping
    public List<FileDto> list(@RequestParam(required = false) Long cycleId,
                              @RequestParam(required = false) Long clientId) {
        List<PayrollFile> result;
        if (cycleId != null) {
            result = files.findByCycleIdOrderByUploadedAtDesc(cycleId);
        } else if (clientId != null) {
            result = files.findByCycleClientIdOrderByUploadedAtDesc(clientId);
        } else {
            result = files.findAll();
        }
        return result.stream().map(this::toDto).toList();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public FileDto upload(@RequestParam Long cycleId,
                          @RequestParam FileKind kind,
                          @RequestParam("file") MultipartFile file,
                          Authentication auth) {
        return toDto(storage.store(cycleId, file, kind, auth.getName()));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable Long id) {
        PayrollFile pf = files.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Unknown file"));
        Resource resource = new PathResource(storage.resolveForDownload(pf));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + pf.getOriginalName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    private FileDto toDto(PayrollFile f) {
        return new FileDto(
                f.getId(),
                f.getCycle().getId(),
                f.getOriginalName(),
                f.getKind().name(),
                f.getStatus().name(),
                f.getSizeBytes(),
                f.getUploadedBy(),
                FMT.format(f.getUploadedAt())
        );
    }
}
