import { Component, OnInit } from '@angular/core';
import { EntrepriseService } from '../../services/entreprise.service';

@Component({
  selector: 'app-list-entreprise',
  templateUrl: './list-entreprise.component.html',
  styleUrls: ['./list-entreprise.component.css']
})
export class ListEntrepriseComponent implements OnInit {
  entreprises: any[] = [];
  errorMessage: string = '';
  searchTerm: string = '';

  get filteredEntreprises() {
    if (!this.searchTerm) return this.entreprises;
    return this.entreprises.filter(e => 
      e.nom_entreprise?.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      e.secteur_activite?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  constructor(private entrepriseService: EntrepriseService) {}

  ngOnInit() {
    this.loadEntreprises();
  }

  loadEntreprises() {
    this.entrepriseService.getEntreprises().subscribe({
      next: (data) => this.entreprises = data,
      error: (err) => this.errorMessage = 'Erreur lors du chargement des entreprises.'
    });
  }

  deleteEntreprise(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette entreprise ?')) {
      this.entrepriseService.deleteEntreprise(id).subscribe({
        next: () => this.loadEntreprises(),
        error: (err) => alert('Erreur lors de la suppression')
      });
    }
  }
}
