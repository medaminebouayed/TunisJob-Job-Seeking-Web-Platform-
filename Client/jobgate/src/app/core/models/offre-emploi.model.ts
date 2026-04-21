import { Entreprise } from './entreprise.model';
import { Recruteur } from './recruteur.model';
import { LocaliteOffre } from './localite-offre.model';
import { CategorieMetier } from './categorie-metier.model';
import { CompetenceRequise } from './competence-requise.model';
import { LangueRequise } from './langue-requise.model';
import { Specialite } from './specialite.model';

export interface OffreEmploi {
  id?: number;
  titre_poste: string;
  reference_offre?: string;
  description: string;
  profil_recherche?: string;
  proposition_avantages?: string;
  type_contrat?: string;
  niveau_etude_requis?: string;
  experience_requise?: string;
  salaire_min?: number;
  salaire_max?: number;
  devise?: string;
  est_anonyme?: boolean;
  frequence_salaire?: string;
  nombre_poste_pourvoir?: number;
  date_publication?: Date;
  date_expiration?: Date;
  statut_offre?: string;
  match_score?: number;
  specialty_id?: number;
  localite_offre_id?: number;

  // Relations according to UML
  entreprise?: Entreprise;
  recruteur?: Recruteur;
  localite?: LocaliteOffre;
  categories_metier?: CategorieMetier[];
  specialite?: Specialite;
  competences_requises?: CompetenceRequise[];
  langues_requises?: LangueRequise[];
  applications?: import('./candidature.model').Candidature[];
}
