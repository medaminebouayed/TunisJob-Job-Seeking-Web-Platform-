import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OffreEmploiService } from '../../../core/services/offre-emploi.service';
import { AuthService, UserRole } from '../../../core/services/auth.service';
import { OffreEmploi } from '../../../core/models/offre-emploi.model';
import { CandidatureService } from '../../../core/services/candidature.service';
import { FavoriService } from '../../../core/services/favori.service';
import { NotificationService } from '../../../core/services/notification.service';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BreadcrumbItem } from '../../../components/breadcrumb/breadcrumb.component';

import { PaginatedResponse } from '../../../core/models/paginated-response.model';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {
  jobsRes: PaginatedResponse<OffreEmploi> | null = null;
  currentPage = 1;
  isLoading = true;

  role$: Observable<UserRole>;
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Accueil', path: '/home' },
    { label: 'Offres d\'emploi', active: true }
  ];
  appliedJobIds = new Set<number>();
  favoritedJobIds = new Set<number>();
  sortBy: string = 'relevance';
  
  // Real Filter state
  filters: any = {
    search: '',
    type_contrat: '',
    salaire_min: null,
    salaire_max: null,
    ville: '',
    categorie_id: null,
    specialty_id: null,
    skill: ''
  };

  // Lists for dropdowns
  categories: any[] = [];
  specialties: any[] = [];

  constructor(
    private jobService: OffreEmploiService,
    private candidatureService: CandidatureService,
    private favoriService: FavoriService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {

    this.role$ = this.authService.role$;
  }

  ngOnInit(): void {
    this.refreshJobs();
    this.loadFilterData();
    this.loadApplicationStatus();
    this.loadFavorites();
  }

  loadFavorites(): void {
    const userRole = this.authService.currentUserValue?.role?.toLowerCase();
    if (userRole === 'candidate') {
      this.favoriService.getFavorites().subscribe({
        next: (favorites: OffreEmploi[]) => {
          favorites.forEach(fav => {
            if (fav.id) this.favoritedJobIds.add(fav.id);
          });
        },
        error: (err) => console.error('Failed to load favorites', err)
      });
    }
  }

  toggleFavorite(jobId: number, event: Event): void {
    event.stopPropagation(); // prevent triggering goToJob
    const userRole = this.authService.currentUserValue?.role?.toLowerCase();
    if (userRole !== 'candidate') {
      this.router.navigate(['/login']);
      return;
    }

    this.favoriService.toggleFavorite(jobId).subscribe({
      next: (res) => {
        if (res.isFavorited) {
          this.favoritedJobIds.add(jobId);
          this.notificationService.showSuccess('Offre ajoutée aux favoris');
        } else {
          this.favoritedJobIds.delete(jobId);
          this.notificationService.showSuccess('Offre retirée des favoris');
        }
      },
      error: (err) => {
        console.error('Failed to toggle favorite', err);
        this.notificationService.showError('Erreur lors de la mise à jour des favoris');
      }
    });
  }

  loadApplicationStatus(): void {
    const userRole = this.authService.currentUserValue?.role?.toLowerCase();
    if (userRole === 'candidate') {
      this.candidatureService.getAllCandidaturesByCandidat().subscribe({
        next: (apps) => {
          apps.forEach((app: any) => {
            if (app.offre_emploi_id) this.appliedJobIds.add(Number(app.offre_emploi_id));
            const offerData = (app.offre as any) || (app.offer as any);
            if (offerData && offerData.id) this.appliedJobIds.add(Number(offerData.id));
          });
        },
        error: (err) => console.error('Failed to load application status', err)
      });
    }
  }

  loadFilterData(): void {
    // Load categories - handle errors gracefully
    this.jobService.getCategories()
      .pipe(
        catchError(err => {
          console.warn('Failed to load categories:', err);
          return of([]);
        })
      )
      .subscribe(res => this.categories = res);

    // Load specialties - handle errors gracefully
    this.jobService.getSpecialties()
      .pipe(
        catchError(err => {
          console.warn('Failed to load specialties:', err);
          return of([]);
        })
      )
      .subscribe(res => this.specialties = res);
  }

  refreshJobs(page: number = 1): void {
    this.currentPage = page;
    this.isLoading = true;
    this.jobService.getPublicJobs({ ...this.filters, per_page: 6 }, page, this.sortBy).subscribe({
      next: (res) => {
        this.jobsRes = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.warn('Failed to load jobs:', err);
        this.jobsRes = null;
        this.isLoading = false;
        this.notificationService.showError('Erreur lors du chargement des offres');
      }
    });
  }

  onPageChange(page: number): void {
    if (page >= 1 && (!this.jobsRes || page <= this.jobsRes.last_page)) {
      this.refreshJobs(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPageNumbers(): number[] {
    if (!this.jobsRes) return [];
    const last = this.jobsRes.last_page;
    const cur = this.currentPage;
    if (last <= 9) {
      return Array.from({ length: last }, (_, i) => i + 1);
    }
    const set = new Set<number>([1, last, cur, cur - 1, cur + 1, cur - 2, cur + 2]);
    return [...set].filter((p) => p >= 1 && p <= last).sort((a, b) => a - b);
  }

  applyFilters(): void {
    this.refreshJobs(1);
  }

  onCategoryChange(): void {
    // When category changes, reset specialty as it might not belong to the new category
    this.filters.specialty_id = null;
    this.applyFilters();
  }

  get filteredSpecialties(): any[] {
    if (!this.filters.categorie_id) return this.specialties;
    return this.specialties.filter(s => s.categorie_id === Number(this.filters.categorie_id));
  }

  resetFilters(): void {
    this.filters = {
      search: '',
      type_contrat: '',
      salaire_min: null,
      salaire_max: null,
      ville: '',
      categorie_id: null,
      specialty_id: null,
      skill: ''
    };
    this.sortBy = 'relevance';
    this.refreshJobs(1);
  }

  goToJob(id?: number): void {
    if (id) {
      this.router.navigate(['/jobs', id]);
    }
  }

  goToApply(id?: number): void {
    if (id) {
      this.router.navigate(['/jobs', id, 'apply']);
    }
  }
}
