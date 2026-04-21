export interface Formation {
  id?: number;
  nom_diplome: string;
  etablissement?: string;
  date_debut?: Date;
  date_fin?: Date;
  niveau_acquis?: string;
  detailles?: string;
}
