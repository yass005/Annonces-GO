/*---------------------------interface pour La gestion des Categorie----------------------------*/
/*	Cette interface sert de modéle de base pour le service Ldes Categorie                      */
import { Observable } from 'rxjs/Rx';
import { Annonce } from './annonce';
export interface ICategorie {

  getNom(key: string)
  getAnnonce(key: string)
  GetAnnoncesParCatégoriePage(key: string)
  findAllAnnonces(): Observable<Annonce[]>

}
