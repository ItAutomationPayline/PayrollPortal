import { Component, Input } from '@angular/core';
import { AuthService } from '../../core/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  key: string;
  paylineOnly?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  /** Active nav key: 'dashboard' | 'file-upload' | 'status' | 'cycles' | 'users' */
  @Input() active = 'dashboard';
  /** Toggle the "Active Cycle" card at the bottom (dashboard only) */
  @Input() showCycle = false;

  private allNavItems: NavItem[] = [
    { label: 'Dashboard',       icon: 'dashboard',       route: '/dashboard',   key: 'dashboard' },
    { label: 'Payroll Cycles',  icon: 'event_available', route: '/cycles',      key: 'cycles', paylineOnly: true },
    { label: 'File Upload',     icon: 'upload_file',     route: '/file-upload', key: 'file-upload' },
    { label: 'History',         icon: 'history',         route: '/status',      key: 'status' },
    { label: 'User Management', icon: 'manage_accounts', route: '/users',       key: 'users', paylineOnly: true }
  ];

  constructor(private auth: AuthService) {}

  get navItems(): NavItem[] {
    const isPayline = this.auth.isPaylineSide;
    return this.allNavItems.filter(item => !item.paylineOnly || isPayline);
  }
}
