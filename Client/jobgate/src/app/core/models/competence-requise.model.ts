export interface CompetenceRequise {
  id?: number;
  nom_competence: string;
  pivot?: {
    niveau_requis: string;
  };
}
