import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';


@Component({
  selector: 'app-login-recruteur',
  templateUrl: './login-recruteur.component.html',
  styleUrls: ['./login-recruteur.component.css']
})
export class LoginRecruteurComponent {
  credentials = {
    email: '',
    password: ''
  };
  isLoading = false;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router, private notificationService: NotificationService) {}


  login(): void {
    this.isLoading = true;
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.user.role === 'recruiter' || res.user.role === 'admin') {
          this.notificationService.showSuccess('Connexion réussie !');
          this.router.navigate(['/recruiter/dashboard']);
        } else {
          this.notificationService.showError('Accès refusé. Cet espace est réservé aux recruteurs.');
          this.authService.logout();
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        this.notificationService.showError('Email ou mot de passe incorrect.');
      }
    });
  }
}
