export interface Recruteur {
  id?: number;
  est_actif?: boolean;
  dernier_connexion?: Date;
  date_inscription?: Date;
  phone?: string;
  prenom?: string;
  nom?: string;
  password?: string; // Normally handled securely
  email: string;
  fonction_entreprise?: string;
  telephone_pro?: string;
  est_verifie?: boolean;
}
