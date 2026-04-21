import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpecialtyService {
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

  getSpecialties(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/specialties`, { headers: this.getHeaders() }).pipe(
      map(specialties => specialties.map(s => ({ ...s, name: s.nom_spec, category_id: s.categorie_id })))
    );
  }

  getSpecialty(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/specialties/${id}`, { headers: this.getHeaders() }).pipe(
      map(s => ({ ...s, name: s.nom_spec, category_id: s.categorie_id }))
    );
  }

  createSpecialty(specialty: { name: string, category_id: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/specialties`, { nom_spec: specialty.name, categorie_id: specialty.category_id }, { headers: this.getHeaders() });
  }

  updateSpecialty(id: number, specialty: { name?: string, category_id?: number }): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/specialties/${id}`, { nom_spec: specialty.name, categorie_id: specialty.category_id }, { headers: this.getHeaders() });
  }

  deleteSpecialty(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/specialties/${id}`, { headers: this.getHeaders() });
  }
}
