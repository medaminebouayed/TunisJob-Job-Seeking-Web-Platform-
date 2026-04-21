import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  credentials = { 
    email: '', 
    password: '' 
  };
  isLoading = false;
  showPassword = false;

  constructor(private router: Router, private authService: AuthService, private notificationService: NotificationService) {}


  login(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.notificationService.showError('Veuillez remplir tous les champs.');
      return;
    }

    this.isLoading = true;
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.notificationService.showSuccess('Connexion réussie !');
        
        // Ensure the role is correctly identified
        const role = res.user?.role?.toLowerCase() || res.role?.toLowerCase();
        
        if (role === 'candidate') {
          this.router.navigate(['/jobs']);
        } else if (role === 'recruiter' || role === 'admin') {
          this.router.navigate(['/recruiter/dashboard']);
        } else {
          // Default fallback
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login error:', err);
        if (err.status === 401 || err.status === 422) {
          this.notificationService.showError('Email ou mot de passe incorrect.');
        } else {
          this.notificationService.showError('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
        }
      }
    });
  }
}
