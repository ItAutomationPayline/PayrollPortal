import { Component, OnInit } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from '../../core/auth.service';
import { PayrollDataService, CycleDto, FileKind, FileDto } from '../../core/payroll-data.service';

interface KindOption {
  value: FileKind;
  label: string;
}

@Component({
  selector: 'app-file-upload',
  standalone: false,
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  isDragging = false;
  showProgress = false;
  fileName = '';
  progress = 0;
  uploading = false;
  errorMessage = '';
  successMessage = '';

  isPaylineSide = false;
  cycles: CycleDto[] = [];
  selectedCycleId: number | null = null;
  kindOptions: KindOption[] = [];
  selectedKind: FileKind | null = null;

  recentUploads: FileDto[] = [];

  private pendingFile: File | null = null;

  // What each side is allowed to upload, per the payroll workflow.
  private clientKinds: KindOption[] = [
    { value: 'CLIENT_INPUT', label: 'Client Input File (step 2)' },
    { value: 'PAID_CHALLAN', label: 'Paid Challan Copy (step 8)' }
  ];
  private paylineKinds: KindOption[] = [
    { value: 'PAYROLL_REPORT', label: 'Payroll Report (step 4)' },
    { value: 'BANK_FILE', label: 'Bank / Salary Disbursement File (step 6)' },
    { value: 'CHALLAN', label: 'Compliance Challan – PF/PT/ESI/LWF/TDS (step 7)' }
  ];

  protocol = [
    'Supported formats: CSV, XLSX, XML, PDF',
    'Max file size: 25MB per file',
    'Files are stored on the secured Payline server'
  ];

  constructor(private auth: AuthService, private data: PayrollDataService) {}

  ngOnInit(): void {
    this.isPaylineSide = this.auth.isPaylineSide;
    this.kindOptions = this.isPaylineSide ? this.paylineKinds : this.clientKinds;
    this.selectedKind = this.kindOptions[0]?.value ?? null;
    this.loadCycles();
  }

  private loadCycles(): void {
    const clientId = this.auth.currentUser?.clientId ?? undefined;
    // Client users see only their cycles; Payline users see all.
    this.data.listCycles(this.isPaylineSide ? undefined : clientId ?? undefined).subscribe({
      next: (cycles) => {
        this.cycles = cycles;
        if (cycles.length && this.selectedCycleId == null) {
          this.selectedCycleId = cycles[0].id;
          this.loadRecent();
        }
      },
      error: () => { this.errorMessage = 'Could not load payroll cycles.'; }
    });
  }

  onCycleChange(): void {
    this.loadRecent();
  }

  private loadRecent(): void {
    if (this.selectedCycleId == null) { this.recentUploads = []; return; }
    this.data.listFiles({ cycleId: this.selectedCycleId }).subscribe({
      next: (files) => { this.recentUploads = files; },
      error: () => { /* non-fatal */ }
    });
  }

  cycleLabel(c: CycleDto): string {
    return `${c.clientName} — ${c.periodMonth}${c.offCycle ? ' (off-cycle)' : ''} [${c.status}]`;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(): void {
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.pendingFile = file;
    this.fileName = file.name;
    this.upload();
  }

  private upload(): void {
    if (!this.pendingFile) { return; }
    if (this.selectedCycleId == null) {
      this.errorMessage = 'Select a payroll cycle before uploading.';
      return;
    }
    if (!this.selectedKind) {
      this.errorMessage = 'Select a file type before uploading.';
      return;
    }

    this.uploading = true;
    this.showProgress = true;
    this.progress = 0;

    this.data.uploadFile(this.selectedCycleId, this.selectedKind, this.pendingFile).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.progress = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          this.uploading = false;
          this.progress = 100;
          this.successMessage = `Uploaded "${this.fileName}" successfully.`;
          this.pendingFile = null;
          this.loadRecent();
        }
      },
      error: (err) => {
        this.uploading = false;
        this.showProgress = false;
        this.errorMessage = err?.error?.error || err?.error?.message ||
          'Upload failed. Please check the file and try again.';
      }
    });
  }

  reset(): void {
    this.showProgress = false;
    this.fileName = '';
    this.progress = 0;
    this.pendingFile = null;
    this.errorMessage = '';
    this.successMessage = '';
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
}
