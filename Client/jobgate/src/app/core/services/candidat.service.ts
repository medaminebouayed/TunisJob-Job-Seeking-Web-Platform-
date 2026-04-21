import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidat } from '../models/candidat.model';

@Injectable({
  providedIn: 'root'
})
export class CandidatService {
  private apiUrl = 'http://localhost:8000/api/candidate';

  constructor(private http: HttpClient) { }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  updateProfile(data: Partial<Candidat>): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, data);
  }

  uploadPhoto(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/profile/photo`, formData);
  }

  // Keep existing methods if still needed, but update to use API
  getCandidatById(id: number): Observable<Candidat> {
    return this.http.get<Candidat>(`http://localhost:8000/api/candidats/${id}`);
  }

  getAllCandidats(): Observable<Candidat[]> {
    return this.http.get<Candidat[]>(`http://localhost:8000/api/candidats`);
  }
}
