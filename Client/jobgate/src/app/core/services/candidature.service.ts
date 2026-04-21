import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Candidature } from '../models/candidature.model';
import { AuthService } from './auth.service';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class CandidatureService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getCandidaturesByCandidat(page: number = 1): Observable<PaginatedResponse<Candidature>> {
    return this.http.get<PaginatedResponse<Candidature>>(`${this.apiUrl}/candidate/candidatures?page=${page}`, { headers: this.getHeaders() });
  }

  getAllCandidaturesByCandidat(): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${this.apiUrl}/candidate/candidatures?paginate=false`, { headers: this.getHeaders() });
  }

  getCandidaturesByOffre(offreId: number): Observable<Candidature[]> {
    // For Recruiter flow (requires different token/route)
    return this.http.get<Candidature[]>(`${this.apiUrl}/recruiter/offers/${offreId}/candidatures`, { headers: this.getHeaders() });
  }

  postuler(payload: any): Observable<any> {
    // payload can be FormData or JSON objects
    return this.http.post<any>(`${this.apiUrl}/candidate/candidatures`, payload, { headers: this.getHeaders() });
  }

  updateEtat(id: number, etat_avancement: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/recruiter/candidatures/${id}/status`, { etat_avancement }, { headers: this.getHeaders() });
  }

  cancelApplication(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/candidate/candidatures/${id}`, { headers: this.getHeaders() });
  }
}
