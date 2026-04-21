import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-categorie-update',
  templateUrl: './categorie-update.component.html',
  styleUrls: ['./categorie-update.component.css']
})
export class CategorieUpdateComponent implements OnInit {
  categoryId!: number;
  category = { name: '' };
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.categoryId = Number(this.route.snapshot.paramMap.get('id'));
    this.categoryService.getCategory(this.categoryId).subscribe({
      next: (data) => this.category.name = data.name,
      error: (err) => {
        alert('Erreur lors de la récupération de la catégorie.');
        this.router.navigate(['/ListCategorie']);
      }
    });
  }

  onSubmit() {
    if (!this.category.name.trim()) return;
    this.isSubmitting = true;
    this.categoryService.updateCategory(this.categoryId, { name: this.category.name }).subscribe({
      next: () => this.router.navigate(['/ListCategorie']),
      error: (err) => {
        alert('Erreur lors de la mise à jour.');
        this.isSubmitting = false;
      }
    });
  }
}
