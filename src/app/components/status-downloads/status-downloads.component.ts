import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { PayrollDataService, FileDto } from '../../core/payroll-data.service';

@Component({
  selector: 'app-status-downloads',
  standalone: false,
  templateUrl: './status-downloads.component.html',
  styleUrls: ['./status-downloads.component.css']
})
export class StatusDownloadsComponent implements OnInit {
  kindFilter = 'All Types';
  loading = false;
  errorMessage = '';

  files: FileDto[] = [];

  kindOptions = ['All Types', 'CLIENT_INPUT', 'PAYROLL_REPORT', 'BANK_FILE', 'CHALLAN', 'PAID_CHALLAN'];

  constructor(private auth: AuthService, private data: PayrollDataService) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading = true;
    const isPayline = this.auth.isPaylineSide;
    const clientId = this.auth.currentUser?.clientId ?? undefined;
    // Payline sees all files; client sees only their own client's files.
    this.data.listFiles(isPayline ? {} : { clientId: clientId ?? undefined }).subscribe({
      next: (files) => { this.files = files; this.loading = false; },
      error: () => { this.errorMessage = 'Could not load files.'; this.loading = false; }
    });
  }

  get filteredFiles(): FileDto[] {
    if (this.kindFilter === 'All Types') return this.files;
    return this.files.filter(f => f.kind === this.kindFilter);
  }

  iconFor(kind: string): string {
    switch (kind) {
      case 'CLIENT_INPUT': return 'upload_file';
      case 'PAYROLL_REPORT': return 'description';
      case 'BANK_FILE': return 'account_balance';
      case 'CHALLAN': return 'receipt_long';
      case 'PAID_CHALLAN': return 'task';
      default: return 'article';
    }
  }

  download(f: FileDto): void {
    this.data.downloadFile(f.id).subscribe({
      next: (blob) => this.triggerBrowserDownload(blob, f.originalName),
      error: () => { this.errorMessage = `Could not download "${f.originalName}".`; }
    });
  }

  private triggerBrowserDownload(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  refresh(): void {
    this.errorMessage = '';
    this.load();
  }
}
