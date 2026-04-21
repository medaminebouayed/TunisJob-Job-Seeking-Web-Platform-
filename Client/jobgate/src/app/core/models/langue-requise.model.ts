export interface LangueRequise {
  id?: number;
  nom_langue: string;
  pivot?: {
    niveau_requis: string;
  };
}
