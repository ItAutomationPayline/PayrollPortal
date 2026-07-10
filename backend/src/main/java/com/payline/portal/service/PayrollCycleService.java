package com.payline.portal.service;

import com.payline.portal.entity.*;
import com.payline.portal.repository.ClientRepository;
import com.payline.portal.repository.PayrollCycleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.Instant;

/**
 * Enforces the payroll cycle transitions defined in Payroll_Cycle_Workflow.pdf.
 * Illegal transitions are rejected so the demo can't skip stages.
 */
@Service
public class PayrollCycleService {

    private final PayrollCycleRepository cycles;
    private final ClientRepository clients;
    private final AuditService audit;

    public PayrollCycleService(PayrollCycleRepository cycles, ClientRepository clients, AuditService audit) {
        this.cycles = cycles;
        this.clients = clients;
        this.audit = audit;
    }

    @Transactional
    public PayrollCycle openMonth(Long clientId, String periodMonth, boolean offCycle, String actor) {
        Client client = clients.findById(clientId)
                .orElseThrow(() -> badRequest("Unknown clientId"));
        PayrollCycle c = new PayrollCycle();
        c.setClient(client);
        c.setPeriodMonth(periodMonth);
        c.setOffCycle(offCycle);
        c.setStatus(CycleStatus.MONTH_OPEN);
        cycles.save(c);
        audit(actor, "OPEN_MONTH", c, "Opened " + periodMonth + (offCycle ? " (off-cycle)" : ""));
        return c;
    }

    /** Transition a cycle to the given target, validating it follows the workflow. */
    @Transactional
    public PayrollCycle transition(Long cycleId, CycleStatus target, String actor) {
        PayrollCycle c = cycles.findById(cycleId)
                .orElseThrow(() -> badRequest("Unknown cycleId"));

        if (!isAllowed(c.getStatus(), target)) {
            throw badRequest("Illegal transition: " + c.getStatus() + " -> " + target);
        }

        // Reject loop: REPORTS_SENT -> PROCESSING increments reject count.
        if (c.getStatus() == CycleStatus.REPORTS_SENT && target == CycleStatus.PROCESSING) {
            c.setRejectCount(c.getRejectCount() + 1);
        }

        c.setStatus(target);
        c.setUpdatedAt(Instant.now());
        cycles.save(c);
        audit(actor, "CYCLE_" + target.name(), c, "Moved to " + target);
        return c;
    }

    /**
     * Allowed transitions mirror the PDF:
     * MONTH_OPEN -> INPUT_UPLOADED -> PROCESSING -> REPORTS_SENT
     * REPORTS_SENT -> APPROVED (approve)  OR  REPORTS_SENT -> PROCESSING (reject loop)
     * APPROVED -> BANK_FILE_SHARED -> CHALLANS_UPLOADED -> CHALLANS_PAID -> MONTH_CLOSED
     */
    private boolean isAllowed(CycleStatus from, CycleStatus to) {
        return switch (from) {
            case MONTH_OPEN       -> to == CycleStatus.INPUT_UPLOADED;
            case INPUT_UPLOADED   -> to == CycleStatus.PROCESSING;
            case PROCESSING       -> to == CycleStatus.REPORTS_SENT;
            case REPORTS_SENT     -> to == CycleStatus.APPROVED || to == CycleStatus.PROCESSING;
            case APPROVED         -> to == CycleStatus.BANK_FILE_SHARED;
            case BANK_FILE_SHARED -> to == CycleStatus.CHALLANS_UPLOADED;
            case CHALLANS_UPLOADED-> to == CycleStatus.CHALLANS_PAID;
            case CHALLANS_PAID    -> to == CycleStatus.MONTH_CLOSED;
            case MONTH_CLOSED     -> false;
        };
    }

    private void audit(String actor, String action, PayrollCycle c, String detail) {
        audit.log(actor, action, "PayrollCycle", String.valueOf(c.getId()), detail);
    }

    private ResponseStatusException badRequest(String msg) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, msg);
    }
}
