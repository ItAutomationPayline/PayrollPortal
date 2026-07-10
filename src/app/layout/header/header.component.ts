import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  /** Which nav link is active: 'dashboard' | 'file-upload' | 'status' | 'users' */
  @Input() active = 'dashboard';

  constructor(private auth: AuthService, private router: Router) {}

  get initials(): string {
    const name = this.auth.currentUser?.fullName ?? '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0 || parts[0] === '') return 'U';
    return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
  }

  get fullName(): string {
    return this.auth.currentUser?.fullName ?? 'User';
  }

  /** True for Payline staff; used to show Payline-only nav such as User Management. */
  get isPaylineSide(): boolean {
    return this.auth.isPaylineSide;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
