import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CurriculumVitae } from '../models/curriculum-vitae.model';

@Injectable({
  providedIn: 'root'
})
export class CvService {
  private apiUrl = 'http://localhost:8000/api/candidate/cv';

  constructor(private http: HttpClient) { }

  getCvByCandidat(): Observable<CurriculumVitae> {
    return this.http.get<CurriculumVitae>(this.apiUrl);
  }

  updateCv(cvId: number, data: Partial<CurriculumVitae>): Observable<CurriculumVitae> {
    return this.http.put<CurriculumVitae>(this.apiUrl, data);
  }

  uploadPdf(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/pdf`, formData);
  }
  deletePdf(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/pdf`);
  }
}
