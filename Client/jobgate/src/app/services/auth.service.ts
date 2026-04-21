import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        this.setSession(res);
      })
    );
  }

  registerCandidate(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/candidate`, data).pipe(
      tap((res: any) => {
        this.setSession(res);
      })
    );
  }

  registerRecruiter(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/recruiter`, data).pipe(
      tap((res: any) => {
        this.setSession(res);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  private setSession(authResult: any) {
    localStorage.setItem('access_token', authResult.access_token);
    localStorage.setItem('user', JSON.stringify(authResult.user));
    this.currentUserSubject.next(authResult.user);
  }
}
