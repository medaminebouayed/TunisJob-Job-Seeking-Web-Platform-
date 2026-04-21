import { Competence } from './competence.model';
import { Langue } from './langue.model';
import { Formation } from './formation.model';
import { ExperiencePro } from './experience-pro.model';
import { Candidat } from './candidat.model';

export interface CurriculumVitae {
  id?: number;
  titre_cv: string;
  synthese_profil?: string;
  fichier_pdf?: string; // DB column
  fichier_pdf_url?: string;
  est_principal?: boolean;
  est_visible?: boolean;
  dernier_maj?: Date;
  
  candidat?: Candidat;
  competences?: Competence[];
  langues?: Langue[];
  formations?: Formation[];
  experiences_pro?: ExperiencePro[];
}
