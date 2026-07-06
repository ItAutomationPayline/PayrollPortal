import { Component } from '@angular/core';

interface ActivityRow {
  file: string;
  id: string;
  timestamp: string;
  status: 'Ready' | 'Processing' | 'Review Required';
  action: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  summary = { processing: 1, ready: 3, errors: 0 };

  // Calendar rendering data for October 2024.
  weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  leadingBlanks = 1;                 // Oct 1 2024 falls on a Tuesday
  daysInMonth = 31;
  processingWindow = [22, 23, 24, 25, 26, 27, 28];

  milestones = [
    'Payroll Input Provision',
    'Data Transformation',
    'Ascent Payroll Run',
    'File Delivery',
    'Client Validation',
    'Approval & Bank Processing',
    'Employee Payment'
  ];

  activity: ActivityRow[] = [
    { file: 'OCT_PAYROLL_V2.csv',      id: '99283-X', timestamp: '2024-10-24 14:20', status: 'Ready',            action: 'download' },
    { file: 'BONUS_DISB_FINAL.xml',    id: '99284-A', timestamp: '2024-10-24 13:45', status: 'Processing',       action: 'visibility' },
    { file: 'NEW_HIRE_SYNC.csv',       id: '99285-L', timestamp: '2024-10-24 11:12', status: 'Review Required',  action: 'edit' },
    { file: 'WEEKLY_HRS_EXTRACT.csv',  id: '99281-Q', timestamp: '2024-10-23 16:55', status: 'Ready',            action: 'download' }
  ];

  get days(): number[] {
    return Array.from({ length: this.daysInMonth }, (_, i) => i + 1);
  }

  get blanks(): number[] {
    return Array.from({ length: this.leadingBlanks }, (_, i) => i);
  }

  isWindow(day: number): boolean {
    return this.processingWindow.includes(day);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      alert('File selected: ' + input.files[0].name + ' (Processing simulation)');
    }
  }
}
