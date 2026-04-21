import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RecruteurService } from '../../../core/services/recruteur.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-recruiter-profile',
  templateUrl: './recruiter-profile.component.html',
  styleUrls: ['./recruiter-profile.component.css']
})
export class RecruiterProfileComponent implements OnInit {
  recruiter: any = {
    prenom: '',
    nom: '',
    fonction_entreprise: '',
    telephone_pro: '',
    email: ''
  };

  originalRecruiter: any = {};
  isEditing = false;
  isLoading = true;
  isSaving = false;

  breadcrumbs = [
    { label: 'Tableau de bord', link: '/recruiter/dashboard' },
    { label: 'Mon Profil', active: true }
  ];

  constructor(
    private router: Router, 
    public authService: AuthService,
    private recruteurService: RecruteurService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile(): void {
    this.isLoading = true;
    this.recruteurService.getProfile().subscribe({
      next: (data) => {
        this.isLoading = false;
        if (data) {
          const nameParts = data.name ? data.name.split(' ') : [];
          this.recruiter.prenom = nameParts[0] || '';
          this.recruiter.nom = nameParts.slice(1).join(' ') || '';
          this.recruiter.email = data.email;

          if (data.recruiter) {
            this.recruiter.fonction_entreprise = data.recruiter.fonction_entreprise || '';
            this.recruiter.telephone_pro = data.recruiter.telephone_pro || '';
          }
          this.originalRecruiter = { ...this.recruiter };
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching recruiter profile:', err);
        this.notificationService.showError('Erreur lors du chargement du profil.');
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.originalRecruiter = { ...this.recruiter };
    }
  }

  cancelEdit(): void {
    this.recruiter = { ...this.originalRecruiter };
    this.isEditing = false;
  }

  save(): void {
    this.isSaving = true;
    this.recruteurService.updateProfile(this.recruiter).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.isEditing = false;
        this.originalRecruiter = { ...this.recruiter };
        this.notificationService.showSuccess('Profil mis à jour avec succès !');
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Save error:', err);
        this.notificationService.showError('Une erreur est survenue lors de la sauvegarde.');
      }
    });
  }
}
