import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private currentUserSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('admin_user');
    if (user) {
      try {
        this.currentUserSubject.next(JSON.parse(user));
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
        // Clear corrupt state
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_token');
      }
    }
  }

  login(credentials: {email: string, password: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/login`, credentials).pipe(
      tap((res: any) => {
        if (res.user.role === 'admin') {
          localStorage.setItem('admin_token', res.access_token);
          localStorage.setItem('admin_user', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        } else {
          throw new Error('Access Denied: You are not an admin.');
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('admin_token');
  }
}
