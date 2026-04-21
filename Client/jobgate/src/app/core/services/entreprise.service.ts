import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entreprise } from '../models/entreprise.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {
  private apiUrl = 'http://127.0.0.1:8000/api/enterprises';

  constructor(private http: HttpClient) { }

  getEntrepriseById(id: number): Observable<Entreprise> {
    return this.http.get<Entreprise>(`${this.apiUrl}/${id}`);
  }

  getAllEntreprises(filters: any = {}, page: number = 1, sort: string = ''): Observable<PaginatedResponse<Entreprise>> {
    const rawPerPage = filters.per_page ?? filters.limit ?? 6;
    const perPage = Math.min(50, Math.max(1, Number(rawPerPage) || 6));

    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', String(perPage));
    if (sort) params = params.set('sort', sort);
    if (filters.ville) params = params.set('ville', filters.ville);
    if (filters.secteur) params = params.set('secteur', filters.secteur);
    if (filters.taille) params = params.set('taille', filters.taille);

    return this.http.get<PaginatedResponse<Entreprise>>(this.apiUrl, { params });
  }

  updateEntreprise(id: number, data: Partial<Entreprise>): Observable<Entreprise> {
    // Note: Admin or Recruiter-specific update endpoints are separate
    return this.http.put<Entreprise>(`${this.apiUrl}/${id}`, data);
  }
}
