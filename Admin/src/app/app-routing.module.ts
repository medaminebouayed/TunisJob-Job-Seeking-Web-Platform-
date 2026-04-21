import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListEntrepriseComponent } from './Entreprise/list-entreprise/list-entreprise.component';
import { ListOffresComponent } from './offresEmploye/list-offres/list-offres.component';
import { ListEmployeComponent } from './Employes/list-employe/list-employe.component';
import { ListCategorieComponent } from './Categorie/list-categorie/list-categorie.component';
import { ListSpecialiteComponent } from './Specialite/list-specialite/list-specialite.component';
import { CategorieAjouterComponent } from './Categorie/categorie-ajouter/categorie-ajouter.component';
import { SpecialiteAjouterComponent } from './Specialite/specialite-ajouter/specialite-ajouter.component';
import { CategorieUpdateComponent } from './Categorie/categorie-update/categorie-update.component';
import { SpecialiteUpdateComponent } from './Specialite/specialite-update/specialite-update.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'ListEntreprise', component: ListEntrepriseComponent, canActivate: [AuthGuard] },
  { path: 'ListOffres', component: ListOffresComponent, canActivate: [AuthGuard] },
  { path: 'ListEmploye', component: ListEmployeComponent, canActivate: [AuthGuard] },
  { path: 'ListCategorie', component: ListCategorieComponent, canActivate: [AuthGuard] },
  { path: 'ListSpecialite', component: ListSpecialiteComponent, canActivate: [AuthGuard] },
  { path: 'CategorieAjouter', component: CategorieAjouterComponent, canActivate: [AuthGuard] },
  { path: 'SpecialiteAjouter', component: SpecialiteAjouterComponent, canActivate: [AuthGuard] },
  { path: 'CategorieUpdate/:id', component: CategorieUpdateComponent, canActivate: [AuthGuard] },
  { path: 'SpecialiteUpdate/:id', component: SpecialiteUpdateComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
