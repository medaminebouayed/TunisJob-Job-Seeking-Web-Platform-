import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntrepriseService } from '../../../core/services/entreprise.service';
import { Entreprise } from '../../../core/models/entreprise.model';
import { OffreEmploiService } from '../../../core/services/offre-emploi.service';
import { OffreEmploi } from '../../../core/models/offre-emploi.model';
import { Observable, of } from 'rxjs';
import { AuthService, UserRole } from '../../../core/services/auth.service';
import { BreadcrumbItem } from '../../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {
  company: Entreprise | undefined;
  jobs$: Observable<OffreEmploi[]> = of([]);
  role$: Observable<UserRole>;
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Accueil', path: '/home' },
    { label: 'Entreprises', path: '/companies' },
    { label: 'Profil', active: true }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private entrepriseService: EntrepriseService,
    private offreService: OffreEmploiService,
    public authService: AuthService
  ) {
    this.role$ = this.authService.role$;
  }

  goToJob(id?: number): void {
    if (id) {
      this.router.navigate(['/jobs', id]);
    }
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.entrepriseService.getEntrepriseById(Number(id)).subscribe({
        next: (data: any) => {
          this.company = data;
          if (data.offers) {
            // Map the company into the offer to match the UI expectation
            const mappedOffers = data.offers.map((o: any) => ({
              ...o,
              entreprise: data,
              localite: o.localite || {}
            }));
            this.jobs$ = of(mappedOffers);
          }
        },
        error: (err) => console.error('Error fetching company:', err)
      });
    }
  }
}
