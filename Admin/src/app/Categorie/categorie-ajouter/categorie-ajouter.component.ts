import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-categorie-ajouter',
  templateUrl: './categorie-ajouter.component.html',
  styleUrls: ['./categorie-ajouter.component.css']
})
export class CategorieAjouterComponent {
  category = { name: '' };
  isSubmitting = false;

  constructor(private categoryService: CategoryService, private router: Router) {}

  onSubmit() {
    if (!this.category.name.trim()) return;
    this.isSubmitting = true;
    this.categoryService.createCategory({ name: this.category.name }).subscribe({
      next: () => {
        this.router.navigate(['/ListCategorie']);
      },
      error: (err) => {
        alert('Erreur: ' + (err.error?.message || err.message));
        this.isSubmitting = false;
      }
    });
  }
}
