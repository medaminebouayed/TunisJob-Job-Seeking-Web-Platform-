import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('admin_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/categories`, { headers: this.getHeaders() }).pipe(
      map(categories => categories.map(c => ({ ...c, name: c.nom_categ })))
    );
  }

  getCategory(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/categories/${id}`, { headers: this.getHeaders() }).pipe(
      map(c => ({ ...c, name: c.nom_categ }))
    );
  }

  createCategory(category: { name: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/categories`, { nom_categ: category.name }, { headers: this.getHeaders() });
  }

  updateCategory(id: number, category: { name: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/categories/${id}`, { nom_categ: category.name }, { headers: this.getHeaders() });
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/categories/${id}`, { headers: this.getHeaders() });
  }
}
