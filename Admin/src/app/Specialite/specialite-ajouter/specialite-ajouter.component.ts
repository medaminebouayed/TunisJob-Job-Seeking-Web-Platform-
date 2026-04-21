import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpecialtyService } from '../../services/specialty.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-specialite-ajouter',
  templateUrl: './specialite-ajouter.component.html',
  styleUrls: ['./specialite-ajouter.component.css']
})
export class SpecialiteAjouterComponent implements OnInit {
  specialty = { name: '', category_id: '' };
  categories: any[] = [];
  isSubmitting = false;

  constructor(
    private specialtyService: SpecialtyService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: () => console.error('Erreur chargement des catégories')
    });
  }

  onSubmit() {
    if (!this.specialty.name.trim() || !this.specialty.category_id) return;
    this.isSubmitting = true;
    this.specialtyService.createSpecialty({
      name: this.specialty.name,
      category_id: Number(this.specialty.category_id)
    }).subscribe({
      next: () => this.router.navigate(['/ListSpecialite']),
      error: (err) => {
        alert('Erreur: ' + (err.error?.message || err.message));
        this.isSubmitting = false;
      }
    });
  }
}
