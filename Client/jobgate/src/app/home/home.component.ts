import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, map, catchError } from 'rxjs';
import { OffreEmploi } from '../core/models/offre-emploi.model';
import { Entreprise } from '../core/models/entreprise.model';
import { OffreEmploiService } from '../core/services/offre-emploi.service';
import { EntrepriseService } from '../core/services/entreprise.service';
import { AuthService, UserRole } from '../core/services/auth.service';
import { BreadcrumbItem } from '../components/breadcrumb/breadcrumb.component';
import { PaginatedResponse } from '../core/models/paginated-response.model';
import { CandidatureService } from '../core/services/candidature.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
   jobs: OffreEmploi[] = [];
   companies: Entreprise[] = [];

   role$: Observable<UserRole>;
   breadcrumbs: BreadcrumbItem[] = [
     { label: 'Accueil', active: true }
   ];
   appliedJobIds = new Set<number>();
   isLoadingJobs = false;
   isLoadingCompanies = false;

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
      private entrepriseService: EntrepriseService,
      private candidatureService: CandidatureService,
      private authService: AuthService,
      private router: Router
    ) {
      this.role$ = this.authService.role$;
    }

    ngOnInit(): void {
      this.refreshJobs();
      this.refreshCompanies();
      this.loadFilterData();
      this.loadApplicationStatus();
    }

    loadApplicationStatus(): void {
      const userRole = this.authService.currentUserValue?.role?.toLowerCase();
      if (userRole === 'candidate') {
        this.candidatureService.getAllCandidaturesByCandidat().subscribe({
          next: (apps) => {
            apps.forEach((app: any) => {
              if (app.offre_emploi_id) this.appliedJobIds.add(Number(app.offre_emploi_id));
              const offerData = app.offre || app.offer;
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

    refreshJobs(): void {
      this.isLoadingJobs = true;
      const jobsRequest: Observable<any> = this.authService.isRecruiter()
        ? this.jobService.getRecruiterOffers()
        : this.jobService.getPublicJobs({ ...this.filters, per_page: 6 }, 1);
  
      jobsRequest.subscribe({
        next: (res) => {
          this.isLoadingJobs = false;
          let list: OffreEmploi[] = [];
          if (res && res.data && Array.isArray(res.data)) {
            list = res.data as OffreEmploi[];
          } else if (Array.isArray(res)) {
            list = res as OffreEmploi[];
          }
          this.jobs = list.slice(0, 6);
        },
        error: (err) => {
          this.isLoadingJobs = false;
          console.warn('Failed to load jobs:', err);
          this.jobs = [];
        }
      });
    }
  
    refreshCompanies(): void {
      this.isLoadingCompanies = true;
      const companyReq: Observable<any> = this.entrepriseService.getAllEntreprises({ per_page: 5 }, 1);
      companyReq.subscribe({
        next: (res) => {
          this.isLoadingCompanies = false;
          const raw = (res && res.data) ? res.data : (Array.isArray(res) ? res : []);
          this.companies = (raw as Entreprise[]).slice(0, 5);
        },
        error: (err) => {
          this.isLoadingCompanies = false;
          console.warn('Failed to load companies:', err);
          this.companies = [];
        }
      });
    }

    applyFilters(): void {
      this.refreshJobs();
      this.refreshCompanies();
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
      this.refreshJobs();
    }

    goToCompany(id?: number): void {
      if (id) {
        this.router.navigate(['/company', id]);
      }
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

    viewAllJobs(): void {
      this.router.navigate(['/jobs']);
    }

    viewAllCompanies(): void {
      this.router.navigate(['/companies']);
    }
}
