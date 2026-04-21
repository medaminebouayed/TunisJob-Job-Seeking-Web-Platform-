import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UserRole } from '../../../core/services/auth.service';
import { OffreEmploiService } from '../../../core/services/offre-emploi.service';
import { OffreEmploi } from '../../../core/models/offre-emploi.model';
import { CandidatureService } from '../../../core/services/candidature.service';
import { FavoriService } from '../../../core/services/favori.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Observable } from 'rxjs';
import { BreadcrumbItem } from '../../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
})
export class JobDetailComponent implements OnInit {
  job: OffreEmploi | undefined;
  role$: Observable<UserRole>;
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Accueil', path: '/home' },
    { label: 'Offres d\'emploi', path: '/jobs' },
    { label: 'Détails', active: true }
  ];
  hasApplied: boolean = false;
  applicationId?: number;
  isFavorited: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: OffreEmploiService,
    private candidatureService: CandidatureService,
    private favoriService: FavoriService,
    private notificationService: NotificationService,
    public authService: AuthService
  ) {
    this.role$ = this.authService.role$;
  }

  applyToJob(): void {
    if (this.job?.id) {
      this.router.navigate(['/jobs', this.job.id, 'apply']);
    }
  }

  cancelApplication(): void {
    if (this.applicationId && confirm('Voulez-vous vraiment annuler votre candidature pour cette offre ?')) {
      this.candidatureService.cancelApplication(this.applicationId).subscribe({
        next: () => {
          this.hasApplied = false;
          this.applicationId = undefined;
          this.notificationService.showSuccess('Candidature annulée avec succès.');
        },
        error: (err) => {
          console.error('Error canceling application:', err);
          this.notificationService.showError('Erreur lors de l\'annulation de la candidature.');
        }
      });
    }
  }

  get formattedDate(): string {
    if (!this.job?.date_publication) return '';
    return new Date(this.job.date_publication).toLocaleDateString();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.jobService.getOffrePublicById(Number(id)).subscribe(
        (data: any) => {
          this.job = {
            ...data,
            entreprise: data.entreprise || data.enterprise,
            specialite: data.specialty || data.specialite,
            competences_requises: data.competencies || data.competences_requises || [],
            langues_requises: data.languages || data.langues_requises || []
          };
          if (this.job && this.job.id) {
            this.checkApplicationStatus(this.job.id);
            this.checkFavoriteStatus(this.job.id);
          }
        },
        error => console.error('Error fetching job details', error)
      );
    }
  }

  checkApplicationStatus(jobId: number): void {
    const userRole = this.authService.currentUserValue?.role?.toLowerCase();
    if (userRole === 'candidate') {
      this.candidatureService.getAllCandidaturesByCandidat().subscribe({
        next: (apps) => {
          const application = apps.find(
            (app: any) => {
              const offerData = app.offre || app.offer;
              return (offerData?.id == jobId || app.offre_emploi_id == jobId);
            }
          );
          if (application) {
            this.hasApplied = true;
            this.applicationId = application.id;
          }
        },
        error: (err) => console.error('Error checking applications:', err)
      });
    }
  }

  checkFavoriteStatus(jobId: number): void {
    const userRole = this.authService.currentUserValue?.role?.toLowerCase();
    if (userRole === 'candidate') {
      this.favoriService.getFavorites().subscribe({
        next: (favorites: OffreEmploi[]) => {
          this.isFavorited = favorites.some(fav => fav.id === jobId);
        },
        error: (err) => console.error('Error checking favorites:', err)
      });
    }
  }

  toggleFavorite(): void {
    const userRole = this.authService.currentUserValue?.role?.toLowerCase();
    if (userRole !== 'candidate') {
      this.router.navigate(['/login']);
      return;
    }
    
    if (this.job?.id) {
      this.favoriService.toggleFavorite(this.job.id).subscribe({
        next: (res) => {
          this.isFavorited = res.isFavorited;
        },
        error: (err) => console.error('Error toggling favorite:', err)
      });
    }
  }
}
