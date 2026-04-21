import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';


@Component({
  selector: 'app-register-recruteur',
  templateUrl: './register-recruteur.component.html',
  styleUrls: ['./register-recruteur.component.css']
})
export class RegisterRecruteurComponent {
  registration: any = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password_confirmation: '',
    jobTitle: '',
    enterpriseName: '',
    enterpriseSector: '',
    phone: ''
  };
  isLoading = false;
  showPassword = false;
  showPasswordConfirm = false;


  constructor(private authService: AuthService, private router: Router, private notificationService: NotificationService) {}


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
      name: `${this.registration.firstName} ${this.registration.lastName}`,
      email: this.registration.email,
      password: this.registration.password,
      password_confirmation: this.registration.password_confirmation,
      fonction_entreprise: this.registration.jobTitle,
      nom_entreprise: this.registration.enterpriseName,
      secteur_activite: this.registration.enterpriseSector,
      telephone_pro: this.registration.phone
    };

    this.isLoading = true;
    this.authService.registerRecruiter(data).subscribe({
      next: () => {
        this.isLoading = false;
        this.notificationService.showSuccess('Inscription réussie !');
        this.router.navigate(['/recruiter/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        this.notificationService.showError('Erreur lors de l\'inscription. Veuillez vérifier les informations.');
      }
    });
  }
}
