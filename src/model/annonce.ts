import { categorie } from "./categorie";
import { Loc } from './location';

export interface Annonce {
  key?: string;
  titre : string;
  description? : string
  categorie?: categorie
  imageURL?: string
  userId?: string
  location? : Loc
}
