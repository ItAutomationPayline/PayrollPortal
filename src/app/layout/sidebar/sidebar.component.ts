import { Component, Input } from '@angular/core';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  key: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  /** Active nav key: 'dashboard' | 'file-upload' | 'status' | 'users' */
  @Input() active = 'dashboard';
  /** Toggle the "Active Cycle" card at the bottom (dashboard only) */
  @Input() showCycle = false;

  navItems: NavItem[] = [
    { label: 'Dashboard',       icon: 'dashboard',       route: '/dashboard',   key: 'dashboard' },
    { label: 'File Upload',     icon: 'upload_file',     route: '/file-upload', key: 'file-upload' },
    { label: 'History',         icon: 'history',         route: '/status',      key: 'status' },
    { label: 'User Management', icon: 'manage_accounts', route: '/users',       key: 'users' }
  ];
}
