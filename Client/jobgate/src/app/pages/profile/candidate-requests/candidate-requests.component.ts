import { Component, OnInit } from '@angular/core';
import { OffreEmploiService } from '../../../core/services/offre-emploi.service';
import { BreadcrumbItem } from '../../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-candidate-requests',
  templateUrl: './candidate-requests.component.html',
  styleUrls: ['./candidate-requests.component.css']
})
export class CandidateRequestsComponent implements OnInit {
  requests: any[] = [];
  isLoading = true;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Accueil', path: '/home' },
    { label: 'Profil', path: '/candidate/profile' },
    { label: 'Demandes de Contact', active: true }
  ];

  constructor(private jobService: OffreEmploiService) { }

  ngOnInit(): void {
    this.fetchRequests();
  }

  fetchRequests(): void {
    this.isLoading = true;
    this.jobService.getReceivedContactRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching contact requests:', err);
        this.isLoading = false;
      }
    });
  }

  getLogo(req: any): string {
    if (req.recruiter?.enterprise?.logo_url) {
      return req.recruiter.enterprise.logo_url;
    }
    return 'assets/images/default-company.png';
  }
}
