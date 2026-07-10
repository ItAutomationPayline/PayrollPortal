package com.payline.portal.controller;

import com.payline.portal.dto.CreateUserRequest;
import com.payline.portal.dto.UserDto;
import com.payline.portal.entity.*;
import com.payline.portal.repository.AppUserRepository;
import com.payline.portal.repository.ClientRepository;
import com.payline.portal.service.AuditService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
public class UserController {

    private static final DateTimeFormatter FMT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").withZone(ZoneId.systemDefault());

    private final AppUserRepository users;
    private final ClientRepository clients;
    private final PasswordEncoder encoder;
    private final AuditService audit;

    public UserController(AppUserRepository users, ClientRepository clients,
                          PasswordEncoder encoder, AuditService audit) {
        this.users = users;
        this.clients = clients;
        this.encoder = encoder;
        this.audit = audit;
    }

    @GetMapping
    public List<UserDto> list() {
        return users.findAll().stream().map(this::toDto).toList();
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CreateUserRequest req, Authentication auth) {
        if (users.existsByEmailIgnoreCase(req.email())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists."));
        }

        Role role;
        try {
            role = Role.valueOf(req.role());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid role."));
        }

        AppUser u = new AppUser();
        u.setFullName(req.fullName());
        u.setEmail(req.email());
        u.setPasswordHash(encoder.encode(req.password()));
        u.setRole(role);
        u.setStatus(UserStatus.ACTIVE);

        boolean clientSide = role == Role.CLIENT_ADMIN || role == Role.CLIENT_REVIEWER;
        if (clientSide) {
            if (req.clientId() == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "clientId is required for client-side roles."));
            }
            Client c = clients.findById(req.clientId()).orElse(null);
            if (c == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Unknown clientId."));
            }
            u.setClient(c);
        }

        users.save(u);
        audit.log(auth.getName(), "CREATE_USER", "AppUser", String.valueOf(u.getId()),
                "Created " + role.name() + " " + u.getEmail());
        return ResponseEntity.ok(toDto(u));
    }

    private UserDto toDto(AppUser u) {
        return new UserDto(
                u.getId(),
                u.getFullName(),
                u.getEmail(),
                u.getRole().name(),
                u.getStatus().name(),
                u.getLastLogin() == null ? "Never" : FMT.format(u.getLastLogin()),
                u.getClient() != null ? u.getClient().getId() : null,
                u.getClient() != null ? u.getClient().getName() : null
        );
    }
}
