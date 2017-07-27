import { categorie } from "./categorie";
import { Loc } from './location';

export interface Annonce {

  titre : string;
  description : string
  categorie: categorie
  imageURL?: string
  location? : Loc
}
