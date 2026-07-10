package com.payline.portal.dto;

public record CycleDto(
        Long id,
        Long clientId,
        String clientName,
        String periodMonth,
        boolean offCycle,
        String status,
        int rejectCount,
        String updatedAt
) {}
