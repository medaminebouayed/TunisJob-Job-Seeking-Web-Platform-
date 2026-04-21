import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

export type UserRole = 'Candidate' | 'Recruiter' | 'Admin' | 'Guest';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private roleSubject = new BehaviorSubject<UserRole>('Guest');
  public role$: Observable<UserRole> = this.roleSubject.asObservable();

  constructor(private http: HttpClient) {
    this.hydrate();
  }

  private hydrate() {
    try {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('access_token');
      
      if (userStr && token) {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.setRoleFromUser(user);
      } else {
        this.clearSession();
      }
    } catch (e) {
      console.error('Error hydrating auth state:', e);
      this.clearSession();
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => this.setSession(res)),
      catchError(err => {
        console.error('Login service error:', err);
        return throwError(() => err);
      })
    );
  }

  registerCandidate(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/candidate`, data).pipe(
      tap((res: any) => this.setSession(res)),
      catchError(err => {
        console.error('Registration service error:', err);
        return throwError(() => err);
      })
    );
  }

  registerRecruiter(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/recruiter`, data).pipe(
      tap((res: any) => this.setSession(res)),
      catchError(err => {
        console.error('Registration service error:', err);
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    // Optional: Call backend logout
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe();
    this.clearSession();
  }

  private clearSession(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.roleSubject.next('Guest');
  }

  private setSession(authResult: any): void {
    if (authResult.access_token) {
      localStorage.setItem('access_token', authResult.access_token);
    }
    if (authResult.user) {
      localStorage.setItem('user', JSON.stringify(authResult.user));
      this.currentUserSubject.next(authResult.user);
      this.setRoleFromUser(authResult.user);
    }
  }

  private setRoleFromUser(user: any): void {
    if (!user || !user.role) {
      this.roleSubject.next('Guest');
      return;
    }

    const role = user.role.toLowerCase();
    if (role === 'candidate' || role === 'candidat') {
      this.roleSubject.next('Candidate');
    } else if (role === 'recruiter' || role === 'recruteur') {
      this.roleSubject.next('Recruiter');
    } else if (role === 'admin') {
      this.roleSubject.next('Admin');
    } else {
      this.roleSubject.next('Guest');
    }
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  public getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  public getCurrentRole(): UserRole {
    return this.roleSubject.value;
  }

  public isCandidate(): boolean {
    return this.getCurrentRole() === 'Candidate';
  }

  public isRecruiter(): boolean {
    return this.getCurrentRole() === 'Recruiter';
  }

  public isAdmin(): boolean {
    return this.getCurrentRole() === 'Admin';
  }
}
