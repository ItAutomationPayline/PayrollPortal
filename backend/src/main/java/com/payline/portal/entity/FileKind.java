package com.payline.portal.entity;

/** What role a file plays in the payroll cycle (see workflow PDF). */
public enum FileKind {
    CLIENT_INPUT,       // step 2: client's monthly input file
    PAYROLL_REPORT,     // step 4: Payline-delivered report
    BANK_FILE,          // step 6: salary disbursement bank file
    CHALLAN,            // step 7: PF/PT/ESI/LWF/TDS challan
    PAID_CHALLAN        // step 8: client's paid challan copy
}
