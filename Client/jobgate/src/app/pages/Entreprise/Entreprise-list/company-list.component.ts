import { Component, OnInit } from '@angular/core';
import { EntrepriseService } from '../../../core/services/entreprise.service';
import { Entreprise } from '../../../core/models/entreprise.model';
import { Observable, of, Subject } from 'rxjs';
import { tap, catchError, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PaginatedResponse } from '../../../core/models/paginated-response.model';
import { AuthService, UserRole } from '../../../core/services/auth.service';
import { BreadcrumbItem } from '../../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {
  companiesRes: PaginatedResponse<Entreprise> | null = null;
  currentPage = 1;
  isLoading = false;
  role$: Observable<UserRole>;
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Accueil', path: '/home' },
    { label: 'Entreprises', active: true }
  ];

  // Filters
  selectedCity: string = '';
  selectedSector: string = '';
  selectedSize: string = '';
  sortBy: string = 'recent';

  private searchSubject = new Subject<void>();

  constructor(
    private entrepriseService: EntrepriseService,
    private router: Router,
    public authService: AuthService
  ) {
    this.role$ = this.authService.role$;
    // Setup debounce for filter changes
    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.loadCompanies();
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(page: number = 1): void {
    this.currentPage = page;
    this.isLoading = true;
    const filters = {
      ville: this.selectedCity,
      secteur: this.selectedSector,
      taille: this.selectedSize,
      per_page: 6
    };

    this.entrepriseService.getAllEntreprises(filters, page, this.sortBy).subscribe({
      next: (res) => {
        this.companiesRes = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading companies:', err);
        this.companiesRes = null;
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    if (page >= 1 && (!this.companiesRes || page <= this.companiesRes.last_page)) {
      this.loadCompanies(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPageNumbers(): number[] {
    if (!this.companiesRes) return [];
    const last = this.companiesRes.last_page;
    const cur = this.currentPage;
    if (last <= 9) {
      return Array.from({ length: last }, (_, i) => i + 1);
    }
    const set = new Set<number>([1, last, cur, cur - 1, cur + 1, cur - 2, cur + 2]);
    return [...set].filter((p) => p >= 1 && p <= last).sort((a, b) => a - b);
  }

  onFilterChange(): void {
    this.loadCompanies(1);
  }

  goToCompany(id?: number): void {
    if (id) {
      this.router.navigate(['/company', id]);
    }
  }
}
