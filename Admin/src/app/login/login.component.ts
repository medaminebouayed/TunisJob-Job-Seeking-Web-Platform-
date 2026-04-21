import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.error = '';
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/']); // Go to Home dashboard
      },
      error: (err) => {
        this.error = err.message || 'Login failed. Please check credentials.';
      }
    });
  }
}
