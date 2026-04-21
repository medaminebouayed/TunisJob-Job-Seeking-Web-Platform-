import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidatureService } from '../../../core/services/candidature.service';
import { OffreEmploiService } from '../../../core/services/offre-emploi.service';
import { CandidatService } from '../../../core/services/candidat.service';
import { CvService } from '../../../core/services/cv.service';
import { Candidature } from '../../../core/models/candidature.model';
import { OffreEmploi } from '../../../core/models/offre-emploi.model';
import { AuthService } from '../../../core/services/auth.service';
import { BreadcrumbItem } from '../../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-job-apply',
  templateUrl: './job-apply.component.html',
  styleUrls: ['./job-apply.component.css']
})
export class JobApplyComponent implements OnInit {
  job: OffreEmploi | undefined;
  useDefaultProfile = true;
  cvType: 'link' | 'upload' = 'link';
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Accueil', path: '/home' },
    { label: 'Offres d\'emploi', path: '/jobs' },
    { label: 'Candidature', active: true }
  ];

  // Custom form models
  lettreMotivation = '';
  cvUrl = '';
  selectedFile: File | null = null;
  selectedFileName = '';

  // Profile completeness check
  isProfileLoading = true;
  profileCompletionScore = 0;
  hasCvContent = false; // true if experiences, formations, or a PDF file exists
  isProfileIncomplete = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private candidatureService: CandidatureService,
    private jobService: OffreEmploiService,
    private candidatService: CandidatService,
    private cvService: CvService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.jobService.getOffrePublicById(Number(id)).subscribe(
        (data: any) => {
          this.job = {
            ...data,
            entreprise: data.entreprise || data.enterprise
          };
        },
        error => console.error('Error fetching job details', error)
      );
    }

    this.checkProfileCompleteness();
  }

  checkProfileCompleteness(): void {
    this.isProfileLoading = true;
    
    // Fetch profile and CV in parallel (simplified)
    this.candidatService.getProfile().subscribe({
      next: (res) => {
        const can = res.candidate;
        let score = 0;
        if (can?.prenom && can?.nom) score += 20;
        if (can?.titre_profil) score += 20;
        if (can?.phone) score += 10;
        if (can?.adresse) score += 10;

        this.cvService.getCvByCandidat().subscribe({
          next: (cv) => {
            if (cv) {
              if (cv.synthese_profil) score += 10;
              if (cv.experiences_pro && cv.experiences_pro.length > 0) score += 10;
              if (cv.formations && cv.formations.length > 0) score += 10;
              if (cv.competences && cv.competences.length > 0) score += 10;

              this.hasCvContent = 
                (cv.experiences_pro && cv.experiences_pro.length > 0) || 
                (cv.formations && cv.formations.length > 0) || 
                (!!cv.fichier_pdf || !!cv.fichier_pdf_url);
            }
            this.profileCompletionScore = score;
            // Profile is considered incomplete if score < 50 OR NO CV content at all
            this.isProfileIncomplete = (score < 50) || !this.hasCvContent;
            this.isProfileLoading = false;
          },
          error: () => {
             this.profileCompletionScore = score;
             this.isProfileIncomplete = true;
             this.isProfileLoading = false;
          }
        });
      },
      error: () => {
        this.isProfileLoading = false;
        this.isProfileIncomplete = true;
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Seul le format PDF est autorisé.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('La taille du fichier doit être inférieure à 5MB.');
        return;
      }
      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }

  submitApplication(): void {
    if (!this.job) return;

    let payload: any;

    if (!this.useDefaultProfile && this.cvType === 'upload' && this.selectedFile) {
      // Use FormData for file uploads
      payload = new FormData();
      payload.append('offre_emploi_id', this.job.id!.toString());
      payload.append('lettre_motivation', this.lettreMotivation);
      payload.append('cv_file', this.selectedFile);
    } else {
      // Use standard JSON payload for link or default profile
      payload = {
        offre_emploi_id: this.job.id,
        lettre_motivation: !this.useDefaultProfile ? this.lettreMotivation : null,
        cv_envoye_url: !this.useDefaultProfile && this.cvType === 'link' ? this.cvUrl : null
      };
    }

    this.candidatureService.postuler(payload).subscribe({
      next: () => {
        alert('Candidature envoyée avec succès !');
        this.router.navigate(['/profile/candidate-applications']);
      },
      error: (err: any) => {
         const msg = err.error?.message || err.message || 'Erreur inconnue';
         alert(`Erreur lors de l'envoi de la candidature:\n${msg}`);
      }
    });
  }
}
