import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-list-categorie',
  templateUrl: './list-categorie.component.html',
  styleUrls: ['./list-categorie.component.css']
})
export class ListCategorieComponent implements OnInit {
  categories: any[] = [];
  errorMessage: string = '';
  searchTerm: string = '';

  get filteredCategories() {
    if (!this.searchTerm) return this.categories;
    return this.categories.filter(c => 
      c.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      c.id.toString().includes(this.searchTerm)
    );
  }

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => this.errorMessage = 'Erreur lors du chargement des catégories.'
    });
  }

  deleteCategory(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (err) => alert('Erreur lors de la suppression')
      });
    }
  }
}
