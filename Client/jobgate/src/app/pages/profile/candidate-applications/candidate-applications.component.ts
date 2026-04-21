import { Component, OnInit } from '@angular/core';
import { Candidature } from '../../../core/models/candidature.model';
import { AuthService } from '../../../core/services/auth.service';
import { CandidatureService } from '../../../core/services/candidature.service';
import { NotificationService } from '../../../core/services/notification.service';
import { BreadcrumbItem } from '../../../components/breadcrumb/breadcrumb.component';
import { PaginatedResponse } from '../../../core/models/paginated-response.model';

@Component({
  selector: 'app-candidate-applications',
  templateUrl: './candidate-applications.component.html',
  styleUrls: ['./candidate-applications.component.css']
})
export class CandidateApplicationsComponent implements OnInit {

  applicationsRes: PaginatedResponse<Candidature> | null = null;
  applications: Candidature[] = [];
  currentPage = 1;
  isLoading = true;
  isCancellingId: number | null = null;
  searchTerm: string = '';
  filterStatus: string = 'Toutes les demandes';

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Accueil', path: '/home' },
    { label: 'Mes Candidatures', active: true }
  ];

  constructor(
    public authService: AuthService, 
    private candidatureService: CandidatureService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(page: number = 1): void {
    this.currentPage = page;
    this.isLoading = true;
    this.candidatureService.getCandidaturesByCandidat(page).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.applicationsRes = res;
        this.applications = res.data.map((app: any) => {
          const offerData = app.offre || app.offer;
          return {
            ...app,
            offre: offerData ? {
              ...offerData,
              entreprise: offerData.entreprise || offerData.enterprise
            } : undefined
          };
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching applications:', err);
        this.notificationService.showError('Erreur lors du chargement de vos candidatures.');
      }
    });
  }

  onPageChange(page: number): void {
    if (page >= 1 && (!this.applicationsRes || page <= this.applicationsRes.last_page)) {
      this.loadApplications(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPageNumbers(): number[] {
    if (!this.applicationsRes) return [];
    const pages = [];
    for (let i = 1; i <= this.applicationsRes.last_page; i++) {
      pages.push(i);
    }
    return pages;
  }

  get filteredApplications(): Candidature[] {
    return this.applications.filter(app => {
      const matchesSearch = !this.searchTerm || 
        (app.offre?.titre_poste?.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (app.offre?.entreprise?.nom_entreprise?.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesStatus = this.filterStatus === 'Toutes les demandes' || app.etat_avancement === this.filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }

  cancelApplication(id?: number): void {
    if (!id) return;
    
    if (confirm('Voulez-vous vraiment annuler cette candidature ?')) {
      this.isCancellingId = id;
      this.candidatureService.cancelApplication(id).subscribe({
        next: () => {
          this.isCancellingId = null;
          this.applications = this.applications.filter(app => app.id !== id);
          this.notificationService.showSuccess('Candidature annulée avec succès.');
        },
        error: (err) => {
          this.isCancellingId = null;
          console.error('Error cancelling application:', err);
          this.notificationService.showError('Erreur lors de l\'annulation de la candidature.');
        }
      });
    }
  }

}
