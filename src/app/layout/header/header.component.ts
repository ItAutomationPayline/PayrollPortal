import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  /** Which nav link is active: 'dashboard' | 'file-upload' | 'status' | 'users' */
  @Input() active = 'dashboard';
  /** Initials shown in the avatar chip */
  @Input() initials = 'JD';
}
