package com.payline.portal.controller;

import com.payline.portal.dto.CycleDto;
import com.payline.portal.entity.CycleStatus;
import com.payline.portal.entity.PayrollCycle;
import com.payline.portal.repository.PayrollCycleRepository;
import com.payline.portal.service.PayrollCycleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cycles")
public class CycleController {

    private static final DateTimeFormatter FMT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").withZone(ZoneId.systemDefault());

    private final PayrollCycleService service;
    private final PayrollCycleRepository cycles;

    public CycleController(PayrollCycleService service, PayrollCycleRepository cycles) {
        this.service = service;
        this.cycles = cycles;
    }

    @GetMapping
    public List<CycleDto> list(@RequestParam(required = false) Long clientId) {
        List<PayrollCycle> result = (clientId == null)
                ? cycles.findAll()
                : cycles.findByClientIdOrderByCreatedAtDesc(clientId);
        return result.stream().map(this::toDto).toList();
    }

    /** Step 1: Payline opens the month. */
    @PostMapping("/open")
    @PreAuthorize("hasAnyRole('PAYLINE_ADMIN','PAYLINE_OPS')")
    public CycleDto open(@RequestBody Map<String, Object> body, Authentication auth) {
        Long clientId = Long.valueOf(String.valueOf(body.get("clientId")));
        String periodMonth = String.valueOf(body.get("periodMonth"));
        boolean offCycle = Boolean.parseBoolean(String.valueOf(body.getOrDefault("offCycle", "false")));
        return toDto(service.openMonth(clientId, periodMonth, offCycle, auth.getName()));
    }

    /**
     * Client-side actions: upload input (INPUT_UPLOADED), approve (APPROVED),
     * reject (back to PROCESSING), pay challans (CHALLANS_PAID).
     */
    @PostMapping("/{id}/client-transition")
    @PreAuthorize("hasAnyRole('CLIENT_ADMIN','CLIENT_REVIEWER')")
    public ResponseEntity<CycleDto> clientTransition(@PathVariable Long id,
                                                     @RequestParam CycleStatus target,
                                                     Authentication auth) {
        if (!(target == CycleStatus.INPUT_UPLOADED
                || target == CycleStatus.APPROVED
                || target == CycleStatus.PROCESSING
                || target == CycleStatus.CHALLANS_PAID)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(toDto(service.transition(id, target, auth.getName())));
    }

    /**
     * Payline-side actions: process (PROCESSING), send reports (REPORTS_SENT),
     * share bank file (BANK_FILE_SHARED), upload challans (CHALLANS_UPLOADED),
     * close month (MONTH_CLOSED).
     */
    @PostMapping("/{id}/payline-transition")
    @PreAuthorize("hasAnyRole('PAYLINE_ADMIN','PAYLINE_OPS')")
    public ResponseEntity<CycleDto> paylineTransition(@PathVariable Long id,
                                                      @RequestParam CycleStatus target,
                                                      Authentication auth) {
        if (!(target == CycleStatus.PROCESSING
                || target == CycleStatus.REPORTS_SENT
                || target == CycleStatus.BANK_FILE_SHARED
                || target == CycleStatus.CHALLANS_UPLOADED
                || target == CycleStatus.MONTH_CLOSED)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(toDto(service.transition(id, target, auth.getName())));
    }

    private CycleDto toDto(PayrollCycle c) {
        return new CycleDto(
                c.getId(),
                c.getClient().getId(),
                c.getClient().getName(),
                c.getPeriodMonth(),
                c.isOffCycle(),
                c.getStatus().name(),
                c.getRejectCount(),
                FMT.format(c.getUpdatedAt())
        );
    }
}
