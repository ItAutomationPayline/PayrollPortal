import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  rememberDevice = false;
  showPassword = false;
  authenticating = false;

  constructor(private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    // Simulated authentication, then route to the dashboard.
    this.authenticating = true;
    setTimeout(() => {
      this.authenticating = false;
      this.router.navigate(['/dashboard']);
    }, 1200);
  }
}
