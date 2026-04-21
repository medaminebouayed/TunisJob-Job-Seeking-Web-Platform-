import { Component, OnInit } from '@angular/core';
import { Entreprise } from '../../../core/models/entreprise.model';
import { RecruteurService } from '../../../core/services/recruteur.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-recruiter-company-editor',
  templateUrl: './recruiter-company-editor.component.html',
  styleUrls: ['./recruiter-company-editor.component.css']
})
export class RecruiterCompanyEditorComponent implements OnInit {
  company: Partial<Entreprise> = {
    nom_entreprise: '',
    description: '',
    secteur_activite: '',
    siret_ou_matricule_fiscal: '',
    logo_url: '',
    banniere_url: '',
    site_web: '',
    taille_effectif: undefined,
    annee_creation: undefined,
    adresse_siege: '',
    ville_siege: ''
  };
  isLoading = true;
  isSaving = false;
  isUploading = false;
  isEditing = false;
  originalCompany: any = {};

  breadcrumbs = [
    { label: 'Tableau de bord', link: '/recruiter/dashboard' },
    { label: 'Paramètres Entreprise', link: '/recruiter/company-settings' }
  ];

  constructor(
    public recruteurService: RecruteurService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.fetchEnterprise();
  }

  fetchEnterprise(): void {
    this.isLoading = true;
    this.recruteurService.getProfile().subscribe({
      next: (data) => {
        this.isLoading = false;
        if (data?.recruiter?.enterprise) {
          this.company = { ...data.recruiter.enterprise };
          this.originalCompany = { ...data.recruiter.enterprise };
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching enterprise data:', err);
        this.notificationService.showError('Erreur lors du chargement des données de l\'entreprise.');
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.originalCompany = { ...this.company };
    }
  }

  cancelEdit(): void {
    this.company = { ...this.originalCompany };
    this.isEditing = false;
  }

  save(): void {
    this.isSaving = true;
    this.recruteurService.updateEnterprise(this.company).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.isEditing = false;
        this.originalCompany = { ...this.company };
        this.notificationService.showSuccess('Informations de l\'entreprise mises à jour avec succès !');
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Update error:', err);
        this.notificationService.showError('Erreur lors de la mise à jour des informations.');
      }
    });
  }

  onLogoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.isUploading = true;
      this.recruteurService.uploadLogo(file).subscribe({
        next: (res) => {
          this.isUploading = false;
          this.company.logo_url = res.logo_url;
          this.notificationService.showSuccess('Logo mis à jour avec succès !');
        },
        error: (err) => {
          this.isUploading = false;
          console.error('Logo upload error:', err);
          this.notificationService.showError('Erreur lors du téléchargement du logo.');
        }
      });
    }
  }

  get completionPercentage(): number {
    const fields = [
      this.company.nom_entreprise,
      this.company.description,
      this.company.secteur_activite,
      this.company.siret_ou_matricule_fiscal,
      this.company.logo_url,
      this.company.banniere_url,
      this.company.site_web,
      this.company.taille_effectif,
      this.company.annee_creation,
      this.company.adresse_siege,
      this.company.ville_siege
    ];
    const filledFields = fields.filter(f => f !== undefined && f !== null && f !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  }
}
