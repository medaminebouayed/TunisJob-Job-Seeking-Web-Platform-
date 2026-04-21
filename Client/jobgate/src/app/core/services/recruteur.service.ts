import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RecruteurService {
  private apiUrl = 'http://localhost:8000/api/recruiter';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, { headers: this.getHeaders() });
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, data, { headers: this.getHeaders() });
  }

  updateEnterprise(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/enterprise`, data, { headers: this.getHeaders() });
  }

  uploadLogo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('logo', file);
    return this.http.post(`${this.apiUrl}/enterprise/logo`, formData, { headers: this.getHeaders() });
  }
}
