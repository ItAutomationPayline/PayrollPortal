package com.payline.portal.entity;

/**
 * Roles across both portal sides.
 * PAYLINE_* = Payline internal staff. CLIENT_* = client company users.
 */
public enum Role {
    PAYLINE_ADMIN,      // full Payline-side admin (user mgmt, all clients)
    PAYLINE_OPS,        // Payline ops: processes payroll, uploads reports/challans
    CLIENT_ADMIN,       // client-side admin: uploads input, manages client users
    CLIENT_REVIEWER     // client-side reviewer: approves/rejects reports
}
