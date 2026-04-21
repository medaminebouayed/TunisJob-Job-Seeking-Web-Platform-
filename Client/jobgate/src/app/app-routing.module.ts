import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobListComponent } from './pages/jobs/job-list/job-list.component';
import { JobDetailComponent } from './pages/jobs/job-detail/job-detail.component';
import { JobApplyComponent } from './pages/jobs/job-apply/job-apply.component';
import { CandidateProfileComponent } from './pages/profile/candidate-profile/candidate-profile.component';
import { CompanyProfileComponent } from './pages/profile/Entreprise-profile/company-profile.component';
import { LoginComponent } from './pages/auth/loginCandidat/login.component';
import { RegisterComponent } from './pages/auth/registerCandidat/register.component';
import { LoginRecruteurComponent } from './pages/auth/login-recruteur/login-recruteur.component';
import { RegisterRecruteurComponent } from './pages/auth/register-recruteur/register-recruteur.component';
import { CompanyListComponent } from './pages/Entreprise/Entreprise-list/company-list.component';
import { CandidateApplicationsComponent } from './pages/profile/candidate-applications/candidate-applications.component';
import { CandidateGuard } from './core/guards/candidate.guard';
import { RecruiterGuard } from './core/guards/recruiter.guard';
import { RecruiterDashboardComponent } from './pages/profile/recruiter-dashboard/recruiter-dashboard.component';
import { RecruiterOfferEditorComponent } from './pages/profile/recruiter-offer-editor/recruiter-offer-editor.component';
import { RecruiterApplicantsComponent } from './pages/profile/recruiter-applicants/recruiter-applicants.component';
import { RecruiterProfileComponent } from './pages/profile/recruiter-profile/recruiter-profile.component';
import { RecruiterCompanyEditorComponent } from './pages/profile/recruiter-company-editor/recruiter-company-editor.component';
import { HomeComponent } from './home/home.component';
import { CandidateFavoritesComponent } from './pages/profile/candidate-favorites/candidate-favorites.component';
import { RecruiterViewCandidateComponent } from './pages/profile/recruiter-view-candidate/recruiter-view-candidate.component';
import { RecruiterCandidateSearchComponent } from './pages/profile/recruiter-candidate-search/recruiter-candidate-search.component';
import { CandidateRequestsComponent } from './pages/profile/candidate-requests/candidate-requests.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'jobs', component: JobListComponent },
  { path: 'jobs/:id', component: JobDetailComponent },
  { path: 'jobs/:id/apply', component: JobApplyComponent },
  { path: 'candidate/profile', component: CandidateProfileComponent /*, canActivate: [CandidateGuard]*/ },
  { path: 'candidate/applications', component: CandidateApplicationsComponent /*, canActivate: [CandidateGuard]*/ },
  { path: 'candidate/favorites', component: CandidateFavoritesComponent /*, canActivate: [CandidateGuard]*/ },
  { path: 'candidate/my-requests', component: CandidateRequestsComponent /*, canActivate: [CandidateGuard]*/ },
  { path: 'recruiter/dashboard', component: RecruiterDashboardComponent /*, canActivate: [RecruiterGuard]*/ },
  { path: 'recruiter/candidate-search', component: RecruiterCandidateSearchComponent /*, canActivate: [RecruiterGuard]*/ },
  { path: 'recruiter/profile', component: RecruiterProfileComponent /*, canActivate: [RecruiterGuard]*/ },
  { path: 'recruiter/company/edit', component: RecruiterCompanyEditorComponent /*, canActivate: [RecruiterGuard]*/ },
  { path: 'recruiter/offers/create', component: RecruiterOfferEditorComponent /*, canActivate: [RecruiterGuard]*/ },
  { path: 'recruiter/offers/:id/edit', component: RecruiterOfferEditorComponent /*, canActivate: [RecruiterGuard]*/ },
  { path: 'recruiter/offers/:id/applicants', component: RecruiterApplicantsComponent /*, canActivate: [RecruiterGuard]*/ },
  { path: 'recruiter/applications/:id/candidate-profile', component: RecruiterViewCandidateComponent /*, canActivate: [RecruiterGuard]*/ },
  { path: 'recruiter/candidates/:id/profile', component: RecruiterViewCandidateComponent /*, canActivate: [RecruiterGuard]*/ },
  { path: 'company/:id', component: CompanyProfileComponent },
  { path: 'companies', component: CompanyListComponent },
  { path: 'login/candidat', component: LoginComponent },
  { path: 'register/candidat', component: RegisterComponent },
  { path: 'login/recruteur', component: LoginRecruteurComponent },
  { path: 'register/recruteur', component: RegisterRecruteurComponent },
  { path: 'login', redirectTo: 'login/candidat', pathMatch: 'full' },
  { path: 'register', redirectTo: 'register/candidat', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
