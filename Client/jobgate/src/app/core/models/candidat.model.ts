export interface Candidat {
  id?: number;
  est_actif?: boolean;
  dernier_connexion?: Date;
  date_inscription?: Date;
  phone?: string;
  prenom?: string;
  nom?: string;
  password?: string;
  email: string;
  civilite?: string;
  url_photo_profil?: string;
  url_portfolio?: string;
  url_linkedin?: string;
  titre_profil?: string;
  recherche_active?: boolean;
  adresse?: string;
  date_naissance?: Date | string;
}
