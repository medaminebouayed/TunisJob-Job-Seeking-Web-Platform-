import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeService {
  private apiUrl = 'http://localhost:8000/api/admin';

  constructor(private http: HttpClient) {}

  getCandidats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/candidates`);
  }

  deleteCandidat(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/candidates/${id}`);
  }
}
