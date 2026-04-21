import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-recruteur',
  templateUrl: './header-recruteur.component.html',
  styleUrls: ['./header-recruteur.component.css']
})
export class HeaderRecruteurComponent {
  constructor(public authService: AuthService, private router: Router) {}
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
