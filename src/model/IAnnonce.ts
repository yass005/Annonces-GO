/*---------------------------interface pour les annonces-------------------------------------*/
/*	Cette interface sert de modéle de base le service des annoncess  Tous ses méthodes      */
/*	 seront implémentées dans le service annonce qui utilise le sdk de firebase     	     */
/*------------------------------------------------------------------------------------    */
import { FirebaseListObservable } from 'angularfire2/database';
import { Annonce } from './annonce';
export interface IAnnonce {

  getAnnonce(key : string)
  getList_des_annonce(): FirebaseListObservable<any>
  removeAnnonce(annonce :Annonce):firebase.Promise<any>
  AjouterAnnonce(annonce: Annonce ):firebase.Promise<any>
}
