package com.payline.portal.service;

import com.payline.portal.dto.LoginRequest;
import com.payline.portal.dto.LoginResponse;
import com.payline.portal.entity.AppUser;
import com.payline.portal.repository.AppUserRepository;
import com.payline.portal.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final AuthenticationManager authManager;
    private final AppUserRepository users;
    private final JwtService jwtService;
    private final AuditService audit;

    public AuthService(AuthenticationManager authManager, AppUserRepository users,
                       JwtService jwtService, AuditService audit) {
        this.authManager = authManager;
        this.users = users;
        this.jwtService = jwtService;
        this.audit = audit;
    }

    @Transactional
    public LoginResponse login(LoginRequest req) {
        // Throws on bad credentials / disabled account.
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password()));

        AppUser user = users.findByEmailIgnoreCase(req.email()).orElseThrow();

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        claims.put("side", user.isPaylineSide() ? "PAYLINE" : "CLIENT");
        if (user.getClient() != null) {
            claims.put("clientId", user.getClient().getId());
        }

        String token = jwtService.generateToken(user.getEmail(), claims);

        user.setLastLogin(Instant.now());
        users.save(user);

        audit.log(user.getEmail(), "LOGIN", "AppUser", String.valueOf(user.getId()),
                user.isPaylineSide() ? "Payline-side login" : "Client-side login");

        return new LoginResponse(
                token,
                user.getEmail(),
                user.getFullName(),
                user.getRole().name(),
                user.isPaylineSide() ? "PAYLINE" : "CLIENT",
                user.getClient() != null ? user.getClient().getId() : null,
                user.getClient() != null ? user.getClient().getName() : null
        );
    }
}
