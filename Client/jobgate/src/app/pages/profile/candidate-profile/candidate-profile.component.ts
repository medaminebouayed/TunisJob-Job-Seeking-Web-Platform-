import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CandidatService } from '../../../core/services/candidat.service';
import { CvService } from '../../../core/services/cv.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Candidat } from '../../../core/models/candidat.model';

import { CurriculumVitae } from '../../../core/models/curriculum-vitae.model';
import { BreadcrumbItem } from '../../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.css']
})
export class CandidateProfileComponent implements OnInit {
  isEditingCandidat = false;
  isEditingCv = false;
  DEFAULT_AVATAR = 'assets/images/default-avatar.jpg';
  photoTimestamp: number = Date.now();
  isLoadingProfile = true;
  isLoadingCv = true;
  isSaving = false;
  isUploadingPhoto = false;
  isUploadingPdf = false;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Accueil', path: '/home' },
    { label: 'Mon Profil', active: true }
  ];
  candidat: Candidat = {} as Candidat;
  cv: CurriculumVitae = {
    titre_cv: '',
    experiences_pro: [],
    formations: [],
    competences: [],
    langues: []
  } as CurriculumVitae;

  constructor(
    private candidatService: CandidatService,
    private cvService: CvService,
    public authService: AuthService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoadingProfile = true;
    this.candidatService.getProfile().subscribe({
      next: (res: any) => {
        this.isLoadingProfile = false;
        const user = res.user || (res.candidate ? res.candidate.user : null);
        const candidate = res.candidate;
        
        if (candidate) {
          if (candidate.date_naissance) {
            candidate.date_naissance = new Date(candidate.date_naissance).toISOString().split('T')[0];
          }

          this.candidat = {
            ...candidate,
            email: user?.email || '',
            prenom: candidate.prenom || user?.name?.split(' ')[0] || '',
            nom: candidate.nom || user?.name?.split(' ').slice(1).join(' ') || ''
          };
          this.photoTimestamp = Date.now();
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        this.isLoadingProfile = false;
        console.error('Error loading profile:', err);
      }
    });

    this.isLoadingCv = true;
    this.cvService.getCvByCandidat().subscribe({
      next: (cvData) => {
        this.isLoadingCv = false;
        if (cvData) {
          this.cv = {
            ...cvData,
            fichier_pdf_url: cvData.fichier_pdf || cvData.fichier_pdf_url,
            experiences_pro: cvData.experiences_pro || [],
            formations: cvData.formations || [],
            competences: cvData.competences || [],
            langues: cvData.langues || []
          };
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.isLoadingCv = false;
        console.error('Error loading CV:', err);
      }
    });
  }


  get profileImageUrl(): string {
    if (this.candidat.url_photo_profil) {
      if (this.candidat.url_photo_profil.startsWith('http')) {
        return `${this.candidat.url_photo_profil}?t=${this.photoTimestamp}`;
      }
      return `http://localhost:8000/storage/${this.candidat.url_photo_profil}?t=${this.photoTimestamp}`;
    }
    return `${this.DEFAULT_AVATAR}?t=${this.photoTimestamp}`;
  }

  triggerPhotoUpload(): void {
    const fileInput = document.getElementById('photoInput') as HTMLInputElement;
    fileInput.click();
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('photo', file);

      this.isUploadingPhoto = true;
      this.candidatService.uploadPhoto(formData).subscribe({
        next: (res: any) => {
          this.isUploadingPhoto = false;
          if (res.url_photo_profil) {
             this.candidat.url_photo_profil = res.url_photo_profil;
          }
          this.photoTimestamp = Date.now();
          this.loadProfile(); 
          this.notificationService.showSuccess('Photo de profil mise à jour avec succès !');
        },
        error: (err: any) => {
          this.isUploadingPhoto = false;
          console.error('Error uploading photo:', err);
          const msg = err.error?.message || 'Vérifiez le format (JPG/PNG < 2Mo).';
          this.notificationService.showError(`Échec de l'envoi : ${msg}`);
        }
      });
    }
  }

  saveCandidat(): void {
    this.isSaving = true;
    this.candidatService.updateProfile(this.candidat).subscribe({
      next: () => {
        this.isSaving = false;
        this.isEditingCandidat = false;
        this.notificationService.showSuccess('Profil mis à jour avec succès');
        this.loadProfile();
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Error updating profile:', err);
        this.notificationService.showError('Erreur lors de la mise à jour du profil');
      }
    });
  }

  saveCv(): void {
    this.isSaving = true;
    const cvId = this.cv.id || 0;
    this.cvService.updateCv(cvId, this.cv).subscribe({
      next: (updatedCv) => {
        this.isSaving = false;
        this.isEditingCv = false;
        this.cv = {
          ...updatedCv,
          experiences_pro: updatedCv.experiences_pro || [],
          formations: updatedCv.formations || [],
          competences: updatedCv.competences || [],
          langues: updatedCv.langues || []
        };
        this.notificationService.showSuccess('CV mis à jour avec succès !');
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Error saving CV:', err);
        this.notificationService.showError('Erreur lors de la sauvegarde du CV.');
      }
    });
  }

  // --- PDF Upload Logic --- //
  triggerPdfUpload(): void {
    const fileInput = document.getElementById('pdfInput') as HTMLInputElement;
    fileInput.click();
  }

  onPdfSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        this.notificationService.showError('Veuillez sélectionner uniquement un fichier au format PDF.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { 
        this.notificationService.showError('La taille du fichier PDF ne doit pas dépasser 5 Mo.');
        return;
      }

      const formData = new FormData();
      formData.append('cv_pdf', file);

      this.isUploadingPdf = true;
      this.cvService.uploadPdf(formData).subscribe({
        next: (res: any) => {
          this.isUploadingPdf = false;
          if (res.fichier_pdf) {
            this.cv.fichier_pdf_url = res.fichier_pdf;
          }
          this.notificationService.showSuccess('Votre CV (PDF) a été uploadé avec succès !');
        },
        error: (err: any) => {
          this.isUploadingPdf = false;
          console.error('Error uploading PDF:', err);
          const msg = err.error?.message || 'Erreur inconnue lors du téléversement.';
          this.notificationService.showError(`Erreur : ${msg}`);
        }
      });
    }
  }

  getPdfUrl(): string | null {
    if (!this.cv.fichier_pdf_url) return null;
    if (this.cv.fichier_pdf_url.startsWith('http')) {
       return this.cv.fichier_pdf_url;
    }
    return `http://localhost:8000/storage/${this.cv.fichier_pdf_url}`;
  }

  deleteCvPdf(): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre CV PDF ?')) return;

    this.cvService.deletePdf().subscribe({
      next: () => {
        this.cv.fichier_pdf_url = undefined;
        this.notificationService.showSuccess('CV PDF supprimé avec succès.');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error deleting CV PDF:', err);
        this.notificationService.showError('Erreur lors de la suppression du CV.');
      }
    });
  }

  addExperience(): void {
    if (!this.cv.experiences_pro) this.cv.experiences_pro = [];
    this.cv.experiences_pro.push({ id: Date.now(), titre_poste: '', nom_employeur: '', poste_actuelle: false });
  }
  removeExperience(index: number): void {
    this.cv.experiences_pro?.splice(index, 1);
  }

  addFormation(): void {
    if (!this.cv.formations) this.cv.formations = [];
    this.cv.formations.push({ id: Date.now(), nom_diplome: '', etablissement: '' });
  }
  removeFormation(index: number): void {
    this.cv.formations?.splice(index, 1);
  }

  addCompetence(): void {
    if (!this.cv.competences) this.cv.competences = [];
    this.cv.competences.push({ id: Date.now(), nom_competence: '', niveau_maitrise: 50 });
  }
  removeCompetence(index: number): void {
    this.cv.competences?.splice(index, 1);
  }

  addLangue(): void {
    if (!this.cv.langues) this.cv.langues = [];
    this.cv.langues.push({ id: Date.now(), nom_langue: '', niveau_parle: 'Débutant', niveau_ecrit: 'Débutant', niveau_lu: 'Débutant' });
  }
  removeLangue(index: number): void {
    this.cv.langues?.splice(index, 1);
  }

  get profileCompletion(): number {
    let score = 0;
    const criteria = [
      { check: !!(this.candidat.prenom && this.candidat.nom) },
      { check: !!this.candidat.email },
      { check: !!this.candidat.phone },
      { check: !!this.candidat.adresse },
      { check: !!this.candidat.titre_profil },
      { check: !!(this.candidat.url_linkedin || this.candidat.url_portfolio) },
      { check: !!this.candidat.url_photo_profil },
      { check: !!this.cv.synthese_profil },
      { check: !!this.cv.fichier_pdf_url },
      { check: !!(this.cv.experiences_pro && this.cv.experiences_pro.length > 0) },
      { check: !!(this.cv.formations && this.cv.formations.length > 0) },
      { check: !!((this.cv.competences && this.cv.competences.length > 0) || (this.cv.langues && this.cv.langues.length > 0)) }
    ];

    criteria.forEach(c => { if (c.check) score++; });
    
    return Math.round((score / criteria.length) * 100);
  }

  formatUrl(url: string | null | undefined): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
      return url;
    }
    return `https://${url}`;
  }
}

