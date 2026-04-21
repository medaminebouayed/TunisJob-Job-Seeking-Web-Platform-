import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpecialtyService } from '../../services/specialty.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-specialite-update',
  templateUrl: './specialite-update.component.html',
  styleUrls: ['./specialite-update.component.css']
})
export class SpecialiteUpdateComponent implements OnInit {
  specialityId!: number;
  specialty = { name: '', category_id: '' };
  categories: any[] = [];
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private specialtyService: SpecialtyService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.specialityId = Number(this.route.snapshot.paramMap.get('id'));
    
    // Fetch categories for dropdown
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: () => console.error('Erreur chargement des catégories')
    });

    // Fetch specialty details
    this.specialtyService.getSpecialty(this.specialityId).subscribe({
      next: (data) => {
        this.specialty.name = data.name;
        this.specialty.category_id = data.category_id;
      },
      error: (err) => {
        alert('Erreur lors de la récupération de la spécialité.');
        this.router.navigate(['/ListSpecialite']);
      }
    });
  }

  onSubmit() {
    if (!this.specialty.name.trim() || !this.specialty.category_id) return;
    this.isSubmitting = true;
    this.specialtyService.updateSpecialty(this.specialityId, { 
      name: this.specialty.name,
      category_id: Number(this.specialty.category_id)
    }).subscribe({
      next: () => this.router.navigate(['/ListSpecialite']),
      error: (err) => {
        alert('Erreur lors de la mise à jour.');
        this.isSubmitting = false;
      }
    });
  }
}
