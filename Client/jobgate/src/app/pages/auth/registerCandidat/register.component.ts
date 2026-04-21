import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  registration: any = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password_confirmation: '',
    gender: 'Mr.',
    birthDate: ''
  };
  isLoading = false;
  showPassword = false;
  showPasswordConfirm = false;

  constructor(private router: Router, private authService: AuthService, private notificationService: NotificationService) {}


  register(): void {
    if (this.registration.password !== this.registration.password_confirmation) {
      this.notificationService.showError('Les mots de passe ne correspondent pas.');
      return;
    }
    if ((this.registration.password || '').length < 8) {
      this.notificationService.showError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    const data = {
      firstName: this.registration.firstName,
      lastName: this.registration.lastName,
      email: this.registration.email,
      password: this.registration.password,
      password_confirmation: this.registration.password_confirmation,
      gender: this.registration.gender,
      birthDate: this.registration.birthDate
    };
    
    this.isLoading = true;
    this.authService.registerCandidate(data).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.notificationService.showSuccess('Inscription réussie !');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Registration error:', err);
        this.notificationService.showError('Inscription échouée. Veuillez vérifier vos informations.');
      }
    });
  }
}
