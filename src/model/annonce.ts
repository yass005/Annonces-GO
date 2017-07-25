import { categorie } from "./categorie";

export interface Annonce {

  titre : string;
  description : string
  categorie: categorie
  imageURL?: string

}
