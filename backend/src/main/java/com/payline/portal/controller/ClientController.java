package com.payline.portal.controller;

import com.payline.portal.entity.Client;
import com.payline.portal.repository.ClientRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientRepository clients;

    public ClientController(ClientRepository clients) {
        this.clients = clients;
    }

    /** List all client companies (Payline staff only). */
    @GetMapping
    @PreAuthorize("hasAnyRole('PAYLINE_ADMIN','PAYLINE_OPS')")
    public List<Map<String, Object>> list() {
        return clients.findAll().stream()
                .map(c -> Map.<String, Object>of("id", c.getId(), "name", c.getName()))
                .toList();
    }

    /** Create a new client company (Payline admin only). */
    @PostMapping
    @PreAuthorize("hasRole('PAYLINE_ADMIN')")
    public Map<String, Object> create(@RequestBody Map<String, String> body) {
        String name = body.getOrDefault("name", "").trim();
        if (name.isEmpty()) {
            throw new IllegalArgumentException("name is required");
        }
        Client saved = clients.findByName(name).orElseGet(() -> clients.save(new Client(name)));
        return Map.of("id", saved.getId(), "name", saved.getName());
    }
}
