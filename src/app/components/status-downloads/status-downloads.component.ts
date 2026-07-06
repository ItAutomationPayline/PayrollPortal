import { Component } from '@angular/core';

type StatusKind = 'ready' | 'processing' | 'uploaded' | 'error';

interface LogRow {
  file: string;
  icon: string;
  date: string;
  status: StatusKind;
  statusLabel: string;
  progress: number;      // 0-100
  progressNote?: string;
}

@Component({
  selector: 'app-status-downloads',
  standalone: false,
  templateUrl: './status-downloads.component.html',
  styleUrls: ['./status-downloads.component.css']
})
export class StatusDownloadsComponent {
  statusFilter = 'All Statuses';
  dateFrom = '';
  dateTo = '';

  statusOptions = ['All Statuses', 'Uploaded Successfully', 'Processing', 'Ready', 'Format Mismatch'];

  rows: LogRow[] = [
    { file: 'Payroll_Main_Q3_Final.xml',          icon: 'description',       date: 'Oct 24, 2023 09:12 AM', status: 'ready',      statusLabel: 'Payroll Process Doc Ready', progress: 100 },
    { file: 'Supplemental_Wages_Oct.csv',         icon: 'sync',              date: 'Oct 24, 2023 11:30 AM', status: 'processing', statusLabel: 'Processing',                progress: 65,  progressNote: 'Calculating Ascent nodes... 65%' },
    { file: 'Contractor_Invoices_v2.csv',         icon: 'article',           date: 'Oct 23, 2023 04:45 PM', status: 'uploaded',   statusLabel: 'Uploaded Successfully',     progress: 5,   progressNote: 'In Queue' },
    { file: 'External_Bonus_List.xlsx',           icon: 'error',             date: 'Oct 22, 2023 01:20 PM', status: 'error',      statusLabel: 'Format Mismatch',           progress: 0,   progressNote: "Column 'Emp_ID' missing in header" },
    { file: 'Tax_Withholding_Correction_R1.xml',  icon: 'description',       date: 'Oct 21, 2023 10:05 AM', status: 'ready',      statusLabel: 'Payroll Process Doc Ready', progress: 100 }
  ];

  get filteredRows(): LogRow[] {
    if (this.statusFilter === 'All Statuses') {
      return this.rows;
    }
    const map: Record<string, StatusKind> = {
      'Uploaded Successfully': 'uploaded',
      'Processing': 'processing',
      'Ready': 'ready',
      'Format Mismatch': 'error'
    };
    return this.rows.filter(r => r.status === map[this.statusFilter]);
  }
}
