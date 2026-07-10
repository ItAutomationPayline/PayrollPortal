package com.payline.portal.dto;

public record FileDto(
        Long id,
        Long cycleId,
        String originalName,
        String kind,
        String status,
        long sizeBytes,
        String uploadedBy,
        String uploadedAt
) {}
