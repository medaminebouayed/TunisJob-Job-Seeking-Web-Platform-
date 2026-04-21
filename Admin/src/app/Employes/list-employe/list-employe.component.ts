import { Component, OnInit } from '@angular/core';
import { EmployeService } from '../../services/employe.service';

@Component({
  selector: 'app-list-employe',
  templateUrl: './list-employe.component.html',
  styleUrls: ['./list-employe.component.css']
})
export class ListEmployeComponent implements OnInit {
  employes: any[] = [];
  errorMessage: string = '';
  searchTerm: string = '';

  get filteredEmployes() {
    if (!this.searchTerm) return this.employes;
    return this.employes.filter(c => 
      c.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      c.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      c.candidate?.titre_profil?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  constructor(private employeService: EmployeService) {}

  ngOnInit() {
    this.loadEmployes();
  }

  loadEmployes() {
    this.employeService.getCandidats().subscribe({
      next: (data) => this.employes = data,
      error: (err) => this.errorMessage = 'Erreur lors du chargement des candidats.'
    });
  }

  deleteCandidat(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce candidat ?')) {
      this.employeService.deleteCandidat(id).subscribe({
        next: () => this.loadEmployes(),
        error: (err) => alert('Erreur lors de la suppression')
      });
    }
  }

  getInitials(name: string): string {
    if (!name) return '??';
    const split = name.split(' ');
    if (split.length >= 2) return (split[0][0] + split[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }
}
