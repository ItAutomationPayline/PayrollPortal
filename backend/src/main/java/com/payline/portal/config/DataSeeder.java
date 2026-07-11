package com.payline.portal.config;

import com.payline.portal.entity.*;
import com.payline.portal.repository.AppUserRepository;
import com.payline.portal.repository.ClientRepository;
import com.payline.portal.repository.PayrollCycleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Seeds demo accounts on first run so you can log in immediately from the Windows laptop.
 * Passwords below are for DEMO ONLY - change them before any real deployment.
 */
@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seed(AppUserRepository users, ClientRepository clients,
                           PayrollCycleRepository cycles, PasswordEncoder encoder) {
        return args -> {
            // --- Accounts (only on a fresh DB) ---
            if (users.count() == 0) {
                Client acme = clients.save(new Client("Acme Enterprises"));

                users.save(user("Payline Admin", "admin@payline.in", "Admin@123",
                        Role.PAYLINE_ADMIN, encoder, null));
                users.save(user("Payline Ops", "ops@payline.in", "Ops@123",
                        Role.PAYLINE_OPS, encoder, null));
                users.save(user("Acme Admin", "admin@acme.com", "Client@123",
                        Role.CLIENT_ADMIN, encoder, acme));
                users.save(user("Acme Reviewer", "reviewer@acme.com", "Review@123",
                        Role.CLIENT_REVIEWER, encoder, acme));

                System.out.println("=== Demo accounts seeded ===");
                System.out.println("Payline admin : admin@payline.in / Admin@123");
                System.out.println("Payline ops   : ops@payline.in / Ops@123");
                System.out.println("Client admin  : admin@acme.com / Client@123");
                System.out.println("Client review : reviewer@acme.com / Review@123");
            }

            // --- One open demo cycle so upload/download can be tested immediately.
            //     Runs even if accounts already exist, but only if there are no cycles. ---
            if (cycles.count() == 0) {
                Client client = clients.findAll().stream().findFirst()
                        .orElseGet(() -> clients.save(new Client("Acme Enterprises")));
                PayrollCycle c = new PayrollCycle();
                c.setClient(client);
                c.setPeriodMonth("2026-07");
                c.setStatus(CycleStatus.MONTH_OPEN);
                cycles.save(c);
                System.out.println("=== Demo payroll cycle seeded: " + client.getName() + " 2026-07 ===");
            }
        };
    }

    private AppUser user(String name, String email, String rawPw, Role role,
                         PasswordEncoder encoder, Client client) {
        AppUser u = new AppUser();
        u.setFullName(name);
        u.setEmail(email);
        u.setPasswordHash(encoder.encode(rawPw));
        u.setRole(role);
        u.setStatus(UserStatus.ACTIVE);
        u.setClient(client);
        return u;
    }
}
