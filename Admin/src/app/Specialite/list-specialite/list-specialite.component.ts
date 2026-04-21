import { Component, OnInit } from '@angular/core';
import { SpecialtyService } from '../../services/specialty.service';

@Component({
  selector: 'app-list-specialite',
  templateUrl: './list-specialite.component.html',
  styleUrls: ['./list-specialite.component.css']
})
export class ListSpecialiteComponent implements OnInit {
  specialties: any[] = [];
  errorMessage: string = '';
  searchTerm: string = '';

  get filteredSpecialties() {
    if (!this.searchTerm) return this.specialties;
    return this.specialties.filter(s => 
      s.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      s.id.toString().includes(this.searchTerm)
    );
  }

  constructor(private specialtyService: SpecialtyService) {}

  ngOnInit() {
    this.loadSpecialties();
  }

  loadSpecialties() {
    this.specialtyService.getSpecialties().subscribe({
      next: (data) => this.specialties = data,
      error: (err) => this.errorMessage = 'Erreur lors du chargement des spécialités.'
    });
  }

  deleteSpecialty(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette spécialité ?')) {
      this.specialtyService.deleteSpecialty(id).subscribe({
        next: () => this.loadSpecialties(),
        error: (err) => alert('Erreur lors de la suppression')
      });
    }
  }
}
