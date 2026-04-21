import { Component, OnInit } from '@angular/core';
import { FavoriService } from '../../../core/services/favori.service';
import { OffreEmploi } from '../../../core/models/offre-emploi.model';
import { BreadcrumbItem } from '../../../components/breadcrumb/breadcrumb.component';
import { AuthService } from '../../../core/services/auth.service';
import { CandidatureService } from '../../../core/services/candidature.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-candidate-favorites',
  templateUrl: './candidate-favorites.component.html',
  styleUrls: ['./candidate-favorites.component.css']
})
export class CandidateFavoritesComponent implements OnInit {
  favorites: OffreEmploi[] = [];
  isLoading: boolean = true;
  isRemovingId: number | null = null;
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Accueil', path: '/home' },
    { label: 'Mes Favoris', active: true }
  ];
  appliedJobIds = new Set<number>();

  constructor(
    private favoriService: FavoriService,
    private candidatureService: CandidatureService,
    public authService: AuthService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadFavorites();
    this.loadApplicationStatus();
  }

  loadApplicationStatus(): void {
    const userRole = this.authService.currentUserValue?.role?.toLowerCase();
    if (userRole === 'candidate') {
      this.candidatureService.getCandidaturesByCandidat().subscribe({
        next: (res) => {
          const apps = res.data;
          apps.forEach(app => {
            if (app.offre_emploi_id) this.appliedJobIds.add(Number(app.offre_emploi_id));
            if (app.offre?.id) this.appliedJobIds.add(Number(app.offre.id));
          });
        },
        error: (err) => console.error('Failed to load application status', err)
      });
    }
  }

  loadFavorites(): void {
    this.isLoading = true;
    this.favoriService.getFavorites().subscribe({
      next: (res: any[]) => {
        this.favorites = res.map(job => ({
          ...job,
          entreprise: job.entreprise || job.enterprise
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching favorites:', err);
        this.isLoading = false;
        this.notificationService.showError('Erreur lors du chargement de vos favoris.');
      }
    });
  }

  removeFavorite(jobId: number): void {
    this.isRemovingId = jobId;
    this.favoriService.toggleFavorite(jobId).subscribe({
      next: () => {
        this.isRemovingId = null;
        this.favorites = this.favorites.filter(job => job.id !== jobId);
        this.notificationService.showSuccess('Offre retirée des favoris.');
      },
      error: (err) => {
        this.isRemovingId = null;
        console.error('Error removing favorite:', err);
        this.notificationService.showError('Erreur lors de la suppression du favori.');
      }
    });
  }
}
