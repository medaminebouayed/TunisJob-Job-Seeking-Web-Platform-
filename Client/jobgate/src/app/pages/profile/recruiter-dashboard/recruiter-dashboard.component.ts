import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { OffreEmploi } from '../../../core/models/offre-emploi.model';
import { OffreEmploiService } from '../../../core/services/offre-emploi.service';
import { NotificationService } from '../../../core/services/notification.service';

import { BreadcrumbItem } from '../../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-recruiter-dashboard',
  templateUrl: './recruiter-dashboard.component.html',
  styleUrls: ['./recruiter-dashboard.component.css']
})
export class RecruiterDashboardComponent implements OnInit {
  myOffers: OffreEmploi[] = [];
  isLoading = true;
  isDeleting: number | null = null;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Accueil', path: '/home' },
    { label: 'Tableau de Bord', active: true }
  ];

  // Filters
  filters = {
    search: '',
    status: '',
    categorie_id: null,
    specialty_id: null
  };

  categories: any[] = [];
  specialties: any[] = [];

  constructor(
    public authService: AuthService,
    private offreService: OffreEmploiService,
    private notificationService: NotificationService
  ) { }


  ngOnInit(): void {
    this.fetchMyOffers();
    this.loadFilterData();
  }

  loadFilterData(): void {
    this.offreService.getCategories().subscribe(res => this.categories = res);
    this.offreService.getSpecialties().subscribe(res => this.specialties = res);
  }

  fetchMyOffers(): void {
    this.isLoading = true;
    this.offreService.getRecruiterOffers(this.filters).subscribe({
      next: (data) => {
        this.myOffers = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching offers:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.fetchMyOffers();
  }

  resetFilters(): void {
    this.filters = {
      search: '',
      status: '',
      categorie_id: null,
      specialty_id: null
    };
    this.fetchMyOffers();
  }

  deleteOffer(id: number | undefined): void {
    if (!id) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette offre d\'emploi ?')) {
      this.isDeleting = id;
      this.offreService.deleteOffre(id).subscribe({
        next: () => {
          this.isDeleting = null;
          this.myOffers = this.myOffers.filter(o => o.id !== id);
          this.notificationService.showSuccess('Offre supprimée avec succès');
        },
        error: (err) => {
          this.isDeleting = null;
          console.error('Delete error:', err);
          this.notificationService.showError('Erreur lors de la suppression de l\'offre');
        }
      });
    }
  }
}
