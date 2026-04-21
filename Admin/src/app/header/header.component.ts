import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  adminName: string = 'Admin User';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const userString = localStorage.getItem('admin_user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        this.adminName = user.name || user.nom || 'Admin User';
      } catch (e) {
        console.error('Failed to parse admin_user from localStorage', e);
      }
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
