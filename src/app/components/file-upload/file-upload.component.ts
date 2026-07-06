import { Component } from '@angular/core';

interface ValidationRow {
  row: string;
  column: string;
  message: string;
  severity: 'error' | 'warning';
}

@Component({
  selector: 'app-file-upload',
  standalone: false,
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  isDragging = false;
  showProgress = false;
  fileName = '';
  progress = 75;

  protocol = [
    'Supported formats: CSV, XLSX',
    'Required columns: EmployeeID, GrossPay, TaxCode, Period',
    'Encryption: AES-256 active on transfer'
  ];

  validationRows: ValidationRow[] = [
    { row: 'Row 14',  column: 'GrossPay',   message: 'Non-numeric value detected ("N/A")',        severity: 'error' },
    { row: 'Row 27',  column: 'TaxCode',    message: 'Unknown tax code "ZZ99"',                   severity: 'error' },
    { row: 'Header',  column: 'Emp_ID',     message: 'Required column missing from header row',   severity: 'error' }
  ];

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
      this.handleFile(files[0].name);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.handleFile(input.files[0].name);
    }
  }

  private handleFile(name: string): void {
    this.fileName = name;
    this.showProgress = true;
  }

  retry(): void {
    this.showProgress = false;
    this.fileName = '';
  }
}
