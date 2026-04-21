import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header-candidat',
  templateUrl: './headerCandidat.component.html',
  styleUrls: ['./headerCandidat.component.css']
})
export class HeaderCandidatComponent {
  constructor(public authService: AuthService, private router: Router) { }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
