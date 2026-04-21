export interface Entreprise {
  id?: number;
  nom_entreprise: string;
  description?: string;
  secteur_activite?: string;
  siret_ou_matricule_fiscal?: string;
  logo_url?: string;
  banniere_url?: string;
  site_web?: string;
  taille_effectif?: number;
  annee_creation?: number;
  adresse_siege?: string;
  ville_siege?: string;
  offres_count?: number;
}
