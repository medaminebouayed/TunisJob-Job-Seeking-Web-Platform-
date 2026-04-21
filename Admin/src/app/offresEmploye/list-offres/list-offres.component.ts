import { Component, OnInit } from '@angular/core';
import { OffreService } from '../../services/offre.service';

@Component({
  selector: 'app-list-offres',
  templateUrl: './list-offres.component.html',
  styleUrls: ['./list-offres.component.css']
})
export class ListOffresComponent implements OnInit {
  offres: any[] = [];
  errorMessage: string = '';
  searchTerm: string = '';
  statusFilter: string = '';

  get filteredOffres() {
    return this.offres.filter(o => {
      const matchesSearch = !this.searchTerm || 
        o.titre_poste?.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        o.type_contrat?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        o.enterprise?.nom_entreprise?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || 
        o.statut_moderation === this.statusFilter ||
        (this.statusFilter === 'Pendante' && !o.statut_moderation);

      return matchesSearch && matchesStatus;
    });
  }

  constructor(private offreService: OffreService) {}

  ngOnInit() {
    this.loadOffres();
  }

  loadOffres() {
    this.offreService.getOffres().subscribe({
      next: (data) => this.offres = data,
      error: (err) => this.errorMessage = 'Erreur lors du chargement des offres.'
    });
  }

  approveOffre(id: number) {
    this.offreService.updateStatus(id, 'Validée').subscribe({
      next: () => this.loadOffres(),
      error: (err) => alert('Erreur lors de la validation')
    });
  }

  rejectOffre(id: number) {
    if (confirm('Voulez-vous vraiment rejeter cette offre ?')) {
      this.offreService.updateStatus(id, 'Rejetée').subscribe({
        next: () => this.loadOffres(),
        error: (err) => alert('Erreur lors du rejet')
      });
    }
  }

  deleteOffre(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette offre ?')) {
      this.offreService.deleteOffre(id).subscribe({
        next: () => this.loadOffres(),
        error: (err) => alert('Erreur lors de la suppression')
      });
    }
  }
}
