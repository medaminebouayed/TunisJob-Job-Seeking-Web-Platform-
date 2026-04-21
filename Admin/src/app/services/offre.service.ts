import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OffreService {
  private apiUrl = 'http://localhost:8000/api/admin';

  constructor(private http: HttpClient) {}

  getOffres(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/offers`);
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/offers/${id}/status`, { status });
  }

  deleteOffre(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/offers/${id}`);
  }
}
