package com.payline.portal.dto;

public record UserDto(
        Long id,
        String fullName,
        String email,
        String role,
        String status,
        String lastLogin,
        Long clientId,
        String clientName
) {}
