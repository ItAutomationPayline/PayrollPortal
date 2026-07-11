import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { PayrollDataService, CycleDto } from '../../core/payroll-data.service';

interface ClientOption {
  id: number;
  name: string;
}

@Component({
  selector: 'app-cycle-management',
  standalone: false,
  templateUrl: './cycle-management.component.html',
  styleUrls: ['./cycle-management.component.css']
})
export class CycleManagementComponent implements OnInit {
  // Form model
  selectedClientId: number | null = null;
  periodMonth = '';         // yyyy-MM from <input type="month">
  offCycle = false;

  creating = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  cycles: CycleDto[] = [];
  clients: ClientOption[] = [];

  // Inline "new client" creation
  showNewClient = false;
  newClientName = '';

  constructor(private auth: AuthService, private data: PayrollDataService, private router: Router) {}

  ngOnInit(): void {
    // Payline-only page; bounce anyone else back to the dashboard.
    if (!this.auth.isPaylineSide) {
      this.router.navigate(['/dashboard']);
      return;
    }
    // Default the period to the current month.
    const now = new Date();
    this.periodMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    this.loadClients();
    this.loadCycles();
  }

  private loadClients(): void {
    this.data.listClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        if (this.selectedClientId == null && clients.length) {
          this.selectedClientId = clients[0].id;
        }
      },
      error: () => { /* fall back to cycle-derived list in loadCycles */ }
    });
  }

  addClient(): void {
    const name = this.newClientName.trim();
    if (!name) { return; }
    this.data.createClient(name).subscribe({
      next: (c) => {
        if (!this.clients.some(x => x.id === c.id)) {
          this.clients = [...this.clients, c].sort((a, b) => a.name.localeCompare(b.name));
        }
        this.selectedClientId = c.id;
        this.newClientName = '';
        this.showNewClient = false;
        this.successMessage = `Client "${c.name}" is ready.`;
      },
      error: (err) => {
        this.errorMessage = err?.error?.error || err?.error?.message || 'Could not add client.';
      }
    });
  }

  private loadCycles(): void {
    this.loading = true;
    this.data.listCycles().subscribe({
      next: (cycles) => {
        this.cycles = cycles;
        this.loading = false;
        // If the clients endpoint returned nothing, derive from existing cycles.
        if (!this.clients.length) {
          const map = new Map<number, string>();
          cycles.forEach(c => map.set(c.clientId, c.clientName));
          this.clients = Array.from(map, ([id, name]) => ({ id, name }))
            .sort((a, b) => a.name.localeCompare(b.name));
          if (this.selectedClientId == null && this.clients.length) {
            this.selectedClientId = this.clients[0].id;
          }
        }
      },
      error: () => { this.errorMessage = 'Could not load cycles.'; this.loading = false; }
    });
  }

  createCycle(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.selectedClientId == null) {
      this.errorMessage = 'Select a client.';
      return;
    }
    if (!this.periodMonth) {
      this.errorMessage = 'Select a payroll month.';
      return;
    }

    this.creating = true;
    this.data.openMonth(this.selectedClientId, this.periodMonth, this.offCycle).subscribe({
      next: (cycle) => {
        this.creating = false;
        this.successMessage =
          `Opened ${cycle.periodMonth} for ${cycle.clientName}${cycle.offCycle ? ' (off-cycle)' : ''}.`;
        this.offCycle = false;
        this.loadCycles();
      },
      error: (err) => {
        this.creating = false;
        this.errorMessage = err?.error?.error || err?.error?.message ||
          'Could not open the month. Please try again.';
      }
    });
  }

  statusClass(status: string): string {
    switch (status) {
      case 'MONTH_OPEN':      return 'bg-primary-container text-on-primary-container';
      case 'MONTH_CLOSED':    return 'bg-surface-container-high text-on-surface-variant';
      case 'APPROVED':
      case 'BANK_FILE_SHARED':return 'bg-tertiary-fixed text-on-tertiary-fixed-variant';
      default:                return 'bg-secondary-container text-on-secondary-container';
    }
  }
}
