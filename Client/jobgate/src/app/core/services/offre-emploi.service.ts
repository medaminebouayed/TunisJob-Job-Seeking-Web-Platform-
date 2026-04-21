import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OffreEmploi } from '../models/offre-emploi.model';
import { PaginatedResponse } from '../models/paginated-response.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OffreEmploiService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getPublicJobs(filters: any = {}, page: number = 1, sort: string = ''): Observable<PaginatedResponse<OffreEmploi>> {
    const rawPerPage = filters.per_page ?? filters.limit ?? 6;
    const perPage = Math.min(50, Math.max(1, Number(rawPerPage) || 6));

    let httpParams = new HttpParams()
      .set('page', page.toString())
      .set('per_page', String(perPage));
    if (sort) {
      httpParams = httpParams.set('sort', sort);
    }
    Object.keys(filters).forEach(key => {
      if (key === 'per_page' || key === 'limit') {
        return;
      }
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        httpParams = httpParams.set(key, filters[key]);
      }
    });

    return this.http.get<PaginatedResponse<OffreEmploi>>(`${this.apiUrl}/jobs`, { params: httpParams });
  }

  getOffrePublicById(id: number): Observable<OffreEmploi> {
    return this.http.get<OffreEmploi>(`${this.apiUrl}/jobs/${id}`);
  }

  getOffres(): Observable<PaginatedResponse<OffreEmploi>> {
    return this.getPublicJobs();
  }

  getRecruiterOffers(filters: any = {}): Observable<OffreEmploi[]> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params = params.set(key, filters[key]);
    });
    return this.http.get<OffreEmploi[]>(`${this.apiUrl}/recruiter/offers`, { params, headers: this.getHeaders() });
  }

  getOffreById(id: number): Observable<OffreEmploi> {
    return this.http.get<OffreEmploi>(`${this.apiUrl}/recruiter/offers/${id}`, { headers: this.getHeaders() });
  }

  createOffre(offre: any): Observable<OffreEmploi> {
    return this.http.post<OffreEmploi>(`${this.apiUrl}/recruiter/offers`, offre, { headers: this.getHeaders() });
  }

  updateOffre(id: number, offre: any): Observable<OffreEmploi> {
    return this.http.put<OffreEmploi>(`${this.apiUrl}/recruiter/offers/${id}`, offre, { headers: this.getHeaders() });
  }

  deleteOffre(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/recruiter/offers/${id}`, { headers: this.getHeaders() });
  }

  updateApplicationStatus(candidatureId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/recruiter/applications/${candidatureId}/status`, { etat_avancement: status }, { headers: this.getHeaders() });
  }

  updateApplicationNote(candidatureId: number, note: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/recruiter/applications/${candidatureId}/note`, { note_recruteur: note }, { headers: this.getHeaders() });
  }

  getCandidateProfileForRecruiter(candidatureId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/recruiter/applications/${candidatureId}/candidate-profile`, { headers: this.getHeaders() });
  }

  // Sourcing & Candidate Search (Recruiter)
  searchCandidates(filters: any = {}, page: number = 1): Observable<PaginatedResponse<any>> {
    let params = new HttpParams().set('page', page.toString());
    Object.keys(filters).forEach(key => {
      if (filters[key]) params = params.set(key, filters[key]);
    });
    return this.http.get<PaginatedResponse<any>>(`${this.apiUrl}/recruiter/search-candidates`, { params, headers: this.getHeaders() });
  }

  sendContactRequest(candidateId: number, message: string = ''): Observable<any> {
    return this.http.post(`${this.apiUrl}/recruiter/contact-requests`, { candidate_id: candidateId, message }, { headers: this.getHeaders() });
  }

  getCandidateProfileDirect(candidateId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/recruiter/candidates/${candidateId}/profile`, { headers: this.getHeaders() });
  }

  // Contact Requests (Candidate)
  getReceivedContactRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/candidate/contact-requests`, { headers: this.getHeaders() });
  }

  // Supporting Data - Public endpoints (no auth required)
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/supporting-data/categories`);
  }

  getSpecialties(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/supporting-data/specialties`);
  }

  getLanguages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/supporting-data/languages`);
  }

  getSkills(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/supporting-data/skills`);
  }
}
