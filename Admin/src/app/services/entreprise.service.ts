import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {
  private apiUrl = 'http://127.0.0.1:8000/api/admin';

  constructor(private http: HttpClient) {}

  getEntreprises(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/enterprises`);
  }

  deleteEntreprise(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/enterprises/${id}`);
  }
}
