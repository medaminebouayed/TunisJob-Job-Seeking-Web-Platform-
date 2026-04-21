import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Categorie } from '../models/categorie.model';
import { CategorieMetier } from '../models/categorie-metier.model';
import { Specialite } from '../models/specialite.model';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  constructor() { }

  getCategories(): Observable<Categorie[]> {
    return of([]).pipe(delay(500));
  }

  getCategorieMetiers(): Observable<CategorieMetier[]> {
    return of([]).pipe(delay(500));
  }

  getSpecialites(): Observable<Specialite[]> {
    return of([]).pipe(delay(500));
  }
}
