import { OffreEmploi } from './offre-emploi.model';
import { Candidat } from './candidat.model';

export interface Candidature {
  id?: number;
  date_postulation: Date;
  lettre_motivation?: string;
  cv_envoye_url?: string;
  etat_avancement?: string;
  note_recruteur?: string;
  offre?: OffreEmploi;
  offre_emploi_id?: number;
  candidat?: Candidat;
  candidate?: Candidat;
}
