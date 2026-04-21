import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OffreEmploiService } from '../../../core/services/offre-emploi.service';
import { BreadcrumbItem } from '../../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-recruiter-view-candidate',
  templateUrl: './recruiter-view-candidate.component.html',
  styleUrls: ['./recruiter-view-candidate.component.css']
})
export class RecruiterViewCandidateComponent implements OnInit {
  candidatureId!: number;
  candidate: any;
  candidature: any;
  primaryCv: any;
  isLoading = true;
  DEFAULT_AVATAR = 'assets/images/default-avatar.jpg';

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Accueil', path: '/home' },
    { label: 'Tableau de Bord', path: '/recruiter/dashboard' },
    { label: 'Profil Candidat', active: true }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offreService: OffreEmploiService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const isDirect = this.router.url.includes('/candidates/');
    
    if (idParam) {
      this.loadData(Number(idParam), isDirect);
    }
  }

  loadData(id: number, isDirect: boolean): void {
    this.isLoading = true;
    
    const request = isDirect 
      ? this.offreService.getCandidateProfileDirect(id)
      : this.offreService.getCandidateProfileForRecruiter(id);

    request.subscribe({
      next: (res: any) => {
        this.candidate = res.candidate || res.candidat;
        this.candidature = res.candidature || null;
        
        // Ensure candidate is fully populated if nested differently
        if (!this.candidate && this.candidature?.candidate) {
           this.candidate = this.candidature.candidate;
        } else if (!this.candidate && this.candidature?.candidat) {
           this.candidate = this.candidature.candidat;
        }

        if (!this.candidate) {
          console.error('Candidate data not found in response:', res);
          this.isLoading = false;
          return;
        }
        
        // Find primary CV or first one
        if (this.candidate.curriculum_vitaes && this.candidate.curriculum_vitaes.length > 0) {
          this.primaryCv = this.candidate.curriculum_vitaes.find((cv: any) => cv.est_principal) || this.candidate.curriculum_vitaes[0];
        } else if (res.cv || res.primaryCv) {
          this.primaryCv = res.cv || res.primaryCv;
        }
        
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading candidate profile:', err);
        this.isLoading = false;
      }
    });
  }

  get profileImageUrl(): string {
    if (this.candidate?.url_photo_profil) {
      if (this.candidate.url_photo_profil.startsWith('http')) return this.candidate.url_photo_profil;
      return `http://localhost:8000/storage/${this.candidate.url_photo_profil}`;
    }
    return this.DEFAULT_AVATAR;
  }

  getPdfUrl(): string | null {
    // Priority 1: Specifically sent CV file for this application
    if (this.candidature?.cv_envoye_url) {
       if (this.candidature.cv_envoye_url.startsWith('applications/')) {
         return `http://localhost:8000/storage/${this.candidature.cv_envoye_url}`;
       }
       return this.candidature.cv_envoye_url;
    }
    
    // Priority 2: Primary CV PDF from profile
    if (this.primaryCv?.fichier_pdf) {
       return `http://localhost:8000/storage/${this.primaryCv.fichier_pdf}`;
    }
    
    return null;
  }

  formatUrl(url: string | null | undefined): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
      return url;
    }
    return `https://${url}`;
  }
}
