import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { HeaderCandidatComponent } from './layouts/headerCandidat/headerCandidat.component';
import { FooterCandidatComponent } from './layouts/footerCandidat/footer.component';
import { JobListComponent } from './pages/jobs/job-list/job-list.component';
import { JobDetailComponent } from './pages/jobs/job-detail/job-detail.component';
import { CandidateProfileComponent } from './pages/profile/candidate-profile/candidate-profile.component';
import { CompanyProfileComponent } from './pages/profile/Entreprise-profile/company-profile.component';
import { JobApplyComponent } from './pages/jobs/job-apply/job-apply.component';
import { LoginComponent } from './pages/auth/loginCandidat/login.component';
import { RegisterComponent } from './pages/auth/registerCandidat/register.component';
import { CompanyListComponent } from './pages/Entreprise/Entreprise-list/company-list.component';
import { CandidateApplicationsComponent } from './pages/profile/candidate-applications/candidate-applications.component';
import { RecruiterDashboardComponent } from './pages/profile/recruiter-dashboard/recruiter-dashboard.component';
import { RecruiterOfferEditorComponent } from './pages/profile/recruiter-offer-editor/recruiter-offer-editor.component';
import { RecruiterApplicantsComponent } from './pages/profile/recruiter-applicants/recruiter-applicants.component';
import { RecruiterProfileComponent } from './pages/profile/recruiter-profile/recruiter-profile.component';
import { RecruiterCompanyEditorComponent } from './pages/profile/recruiter-company-editor/recruiter-company-editor.component';
import { HomeComponent } from './home/home.component';
import { HeaderVistorComponent } from './header-vistor/header-vistor.component';
import { FooterVistorComponent } from './footer-vistor/footer-vistor.component';
import { FooterRecruteurComponent } from './layouts/footer-recruteur/footer-recruteur.component';
import { HeaderRecruteurComponent } from './layouts/header-recruteur/header-recruteur.component';
import { LoginRecruteurComponent } from './pages/auth/login-recruteur/login-recruteur.component';
import { RegisterRecruteurComponent } from './pages/auth/register-recruteur/register-recruteur.component';
import { CandidaturePostComponent } from './candidature-post/candidature-post.component';
import { CandidateFavoritesComponent } from './pages/profile/candidate-favorites/candidate-favorites.component';
import { RecruiterViewCandidateComponent } from './pages/profile/recruiter-view-candidate/recruiter-view-candidate.component';
import { RecruiterCandidateSearchComponent } from './pages/profile/recruiter-candidate-search/recruiter-candidate-search.component';
import { CandidateRequestsComponent } from './pages/profile/candidate-requests/candidate-requests.component';
import { ToastComponent } from './components/shared/toast/toast.component';


@NgModule({
  declarations: [
    AppComponent,
    BreadcrumbComponent,
    HeaderCandidatComponent,
    FooterCandidatComponent,
    JobListComponent,
    JobDetailComponent,
    CandidateProfileComponent,
    CompanyProfileComponent,
    JobApplyComponent,
    LoginComponent,
    RegisterComponent,
    CompanyListComponent,
    CandidateApplicationsComponent,
    RecruiterDashboardComponent,
    RecruiterOfferEditorComponent,
    RecruiterApplicantsComponent,
    RecruiterProfileComponent,
    RecruiterCompanyEditorComponent,
    HomeComponent,
    HeaderVistorComponent,
    FooterVistorComponent,
    FooterRecruteurComponent,
    HeaderRecruteurComponent,
    LoginRecruteurComponent,
    RegisterRecruteurComponent,
    CandidaturePostComponent,
    CandidateFavoritesComponent,
    RecruiterViewCandidateComponent,
    RecruiterCandidateSearchComponent,
    CandidateRequestsComponent,
    ToastComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    RouterModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
