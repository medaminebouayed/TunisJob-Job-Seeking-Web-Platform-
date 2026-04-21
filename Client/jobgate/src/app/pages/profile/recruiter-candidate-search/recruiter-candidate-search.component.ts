import { Component, OnInit } from '@angular/core';
import { OffreEmploiService } from '../../../core/services/offre-emploi.service';
import { BreadcrumbItem } from '../../../components/breadcrumb/breadcrumb.component';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { PaginatedResponse } from '../../../core/models/paginated-response.model';

@Component({
  selector: 'app-recruiter-candidate-search',
  templateUrl: './recruiter-candidate-search.component.html',
  styleUrls: ['./recruiter-candidate-search.component.css']
})
export class RecruiterCandidateSearchComponent implements OnInit {
  candidates: any[] = [];
  candidatesRes: PaginatedResponse<any> | null = null;
  currentPage = 1;
  isLoading = true;
  filters = {
    search: '',
    ville: '',
    skill: ''
  };

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Accueil', path: '/home' },
    { label: 'Tableau de Bord', path: '/recruiter/dashboard' },
    { label: 'Recherche Talents', active: true }
  ];

  constructor(
    private jobService: OffreEmploiService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.search();
  }

  search(page: number = 1): void {
    this.currentPage = page;
    this.isLoading = true;
    this.jobService.searchCandidates(this.filters, page).subscribe({
      next: (res) => {
        this.candidatesRes = res;
        this.candidates = res.data.map((c: any) => ({
          ...c,
          requestSent: !!c.already_requested
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error searching candidates:', err);
        this.isLoading = false;
        this.notificationService.showError('Erreur lors de la recherche des candidats.');
      }
    });
  }

  onPageChange(page: number): void {
    if (page >= 1 && (!this.candidatesRes || page <= this.candidatesRes.last_page)) {
      this.search(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPageNumbers(): number[] {
    if (!this.candidatesRes) return [];
    const pages = [];
    for (let i = 1; i <= this.candidatesRes.last_page; i++) {
      pages.push(i);
    }
    return pages;
  }

  resetFilters(): void {
    this.filters = { search: '', ville: '', skill: '' };
    this.search(1);
  }

  viewProfile(candidateId: number): void {
    this.router.navigate(['/recruiter/candidates', candidateId, 'profile']);
  }

  expressInterest(candidate: any): void {
    if (candidate.sendingRequest) return;
    
    candidate.sendingRequest = true;
    this.jobService.sendContactRequest(candidate.id).subscribe({
      next: () => {
        candidate.requestSent = true;
        candidate.sendingRequest = false;
        this.notificationService.showSuccess(`Demande envoyée avec succès à ${candidate.prenom} !`);
      },
      error: (err) => {
        console.error('Error sending request:', err);
        candidate.sendingRequest = false;
        const msg = err.error?.message || 'Erreur lors de l\'envoi de la demande.';
        this.notificationService.showError(msg);
      }
    });
  }

  getAvatar(candidate: any): string {
    if (candidate.url_photo_profil) {
       return `http://localhost:8000/storage/${candidate.url_photo_profil}`;
    }
    return 'assets/images/default-avatar.jpg';
  }
}
