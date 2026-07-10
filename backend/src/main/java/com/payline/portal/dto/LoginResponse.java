package com.payline.portal.dto;

public record LoginResponse(
        String token,
        String email,
        String fullName,
        String role,
        String side,          // "PAYLINE" or "CLIENT"
        Long clientId,
        String clientName
) {}
