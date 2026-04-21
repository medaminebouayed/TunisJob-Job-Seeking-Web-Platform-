import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Candidature } from '../../../core/models/candidature.model';
import { OffreEmploiService } from '../../../core/services/offre-emploi.service';
import { NotificationService } from '../../../core/services/notification.service';
import { BreadcrumbItem } from '../../../components/breadcrumb/breadcrumb.component';


@Component({
  selector: 'app-recruiter-applicants',
  templateUrl: './recruiter-applicants.component.html',
  styleUrls: ['./recruiter-applicants.component.css']
})
export class RecruiterApplicantsComponent implements OnInit {
  offerId!: number;
  applicants: Candidature[] = [];
  isLoading = true;
  updatingStatusId: number | null = null;
  savingNoteId: number | null = null;

  // Filters & Sorting
  searchTerm: string = '';
  statusFilter: string = 'all';
  sortBy: string = 'newest';

  breadcrumbs = [
    { label: 'Tableau de bord', link: '/recruiter/dashboard' },
    { label: 'Mes Offres', link: '/recruiter/dashboard' },
    { label: 'Révision des Candidatures', active: true }
  ];

  constructor(
    private route: ActivatedRoute,
    private offreService: OffreEmploiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.offerId = Number(idParam);
      this.fetchApplicants();
    }
  }

  fetchApplicants(): void {
    this.isLoading = true;
    this.offreService.getOffreById(this.offerId).subscribe({
      next: (data) => {
        this.applicants = data.applications || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching applicants:', err);
        this.notificationService.showError('Erreur lors du chargement des candidats');
      }
    });
  }

  get filteredApplicants(): Candidature[] {
    let result = [...this.applicants];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(app => {
        const p = app.candidate?.prenom || app.candidat?.prenom || '';
        const n = app.candidate?.nom || app.candidat?.nom || '';
        const t = app.candidate?.titre_profil || app.candidat?.titre_profil || '';
        return p.toLowerCase().includes(term) || n.toLowerCase().includes(term) || t.toLowerCase().includes(term);
      });
    }

    // Status filter
    if (this.statusFilter !== 'all') {
      result = result.filter(app => {
        if (this.statusFilter === 'En attente') return app.etat_avancement === 'En attente';
        if (this.statusFilter === 'Acceptée') return app.etat_avancement === 'Acceptée';
        if (this.statusFilter === 'Refusée') return app.etat_avancement === 'Refusée';
        return true;
      });
    }

    // Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.date_postulation || 0).getTime();
      const dateB = new Date(b.date_postulation || 0).getTime();
      return this.sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.sortBy = 'newest';
  }

  updateStatus(applicant: Candidature, status: string): void {
    if (!applicant.id) return;
    this.updatingStatusId = applicant.id;
    this.offreService.updateApplicationStatus(applicant.id, status).subscribe({
      next: () => {
        this.updatingStatusId = null;
        applicant.etat_avancement = status;
        this.notificationService.showSuccess('Statut mis à jour avec succès');
      },
      error: (err) => {
        this.updatingStatusId = null;
        console.error('Status update error:', err);
        this.notificationService.showError('Erreur lors de la mise à jour du statut');
      }
    });
  }

  saveNote(applicant: Candidature): void {
    if (!applicant.id) return;
    this.savingNoteId = applicant.id;
    this.offreService.updateApplicationNote(applicant.id, applicant.note_recruteur || '').subscribe({
      next: () => {
        this.savingNoteId = null;
        let firstName = applicant.candidate?.prenom || applicant.candidat?.prenom || '';
        let lastName = applicant.candidate?.nom || applicant.candidat?.nom || '';
        const name = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : 'le candidat';
        this.notificationService.showSuccess(`Note enregistrée pour ${name}`);
      },
      error: (err) => {
        this.savingNoteId = null;
        console.error('[RecruiterNote] Error saving note:', err);
        this.notificationService.showError('Erreur lors de l\'enregistrement de la note.');
      }
    });
  }
}
