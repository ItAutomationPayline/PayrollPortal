import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

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
  errorMessage = '';

  constructor(private router: Router, private auth: AuthService) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }

    this.authenticating = true;
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.authenticating = false;
        // Both sides land on the dashboard; the UI adapts to user.side.
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.authenticating = false;
        this.errorMessage =
          err?.error?.error || 'Login failed. Please check your credentials and try again.';
      }
    });
  }
}
