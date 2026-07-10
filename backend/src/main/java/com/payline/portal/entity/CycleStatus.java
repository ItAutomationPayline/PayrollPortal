package com.payline.portal.entity;

/**
 * Maps directly to the 9-step Payroll Cycle Workflow (see Payroll_Cycle_Workflow.pdf).
 * The reject path sends a cycle from REPORTS_SENT back to PROCESSING (re-enters at step 3).
 */
public enum CycleStatus {
    MONTH_OPEN,          // 1. Payline opens the month
    INPUT_UPLOADED,      // 2. Client uploads input file
    PROCESSING,          // 3. Payline processes payroll (reject loop re-enters here)
    REPORTS_SENT,        // 4. Payline sends payroll reports
    // 5. Client review is a decision point -> APPROVED or back to PROCESSING
    APPROVED,            // 5a. Client approved
    BANK_FILE_SHARED,    // 6. Payline shares salary disbursement bank file
    CHALLANS_UPLOADED,   // 7. Payline uploads PF/PT/ESI/LWF/TDS challans
    CHALLANS_PAID,       // 8. Client pays and uploads paid challan copies
    MONTH_CLOSED         // 9. Month close
}
