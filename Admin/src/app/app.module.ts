import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ListEntrepriseComponent } from './Entreprise/list-entreprise/list-entreprise.component';
import { ListOffresComponent } from './offresEmploye/list-offres/list-offres.component';
import { ListCategorieComponent } from './Categorie/list-categorie/list-categorie.component';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';

import { FootComponent } from './foot/foot.component';
import { ListEmployeComponent } from './Employes/list-employe/list-employe.component';

import { CategorieAjouterComponent } from './Categorie/categorie-ajouter/categorie-ajouter.component';
import { CategorieUpdateComponent } from './Categorie/categorie-update/categorie-update.component';
import { ListSpecialiteComponent } from './Specialite/list-specialite/list-specialite.component';
import { SpecialiteAjouterComponent } from './Specialite/specialite-ajouter/specialite-ajouter.component';
import { SpecialiteUpdateComponent } from './Specialite/specialite-update/specialite-update.component';
import { LoginComponent } from './login/login.component';
import { AuthInterceptor } from './services/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ListEntrepriseComponent,
    ListOffresComponent,
    ListCategorieComponent,
    HeaderComponent,
    NavbarComponent,

    FootComponent,
     ListEmployeComponent,
     CategorieAjouterComponent,
     CategorieUpdateComponent,
     ListSpecialiteComponent,
     SpecialiteAjouterComponent,
     SpecialiteAjouterComponent,
     SpecialiteUpdateComponent,
     LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
