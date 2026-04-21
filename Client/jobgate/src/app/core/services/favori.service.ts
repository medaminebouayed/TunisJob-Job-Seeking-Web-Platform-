import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { OffreEmploi } from '../models/offre-emploi.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriService {
  private apiUrl = 'http://localhost:8000/api/candidate/favorites';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getFavorites(): Observable<OffreEmploi[]> {
    return this.http.get<OffreEmploi[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  toggleFavorite(offreId: number): Observable<{message: string, isFavorited: boolean}> {
    return this.http.post<{message: string, isFavorited: boolean}>(`${this.apiUrl}/${offreId}/toggle`, {}, { headers: this.getHeaders() });
  }
}
