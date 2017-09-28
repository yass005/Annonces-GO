/*---------------------------Service pour Les annonces-------------------------           */
/* Service AnnonceProvider qui gère les Annonces des users en utilisant angularfire2 */
/*ce service permet de récupérer une reference depuis firebase de la liste des annonces */
/* FirebaseListObservable. fournit une liste  observable des annonces  et de           */
/*  Synchroniser les collections de base de données en tant qu'objets ou listes.     */
/*---------------------------------------------------------------------------------*/
/*importe des interface de la bibliothèque Angular de '@angular/core' et  Modules angularfire2 necessaires */
import {LoadingController} from 'ionic-angular';
import { Annonce } from './../../model/annonce';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { annonces } from '../../model/Annonces';
import { AngularFireDatabase, AngularFireDatabaseModule, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { ProfileProvider } from '../profile/profile';
import * as firebase from 'firebase';
import { IAnnonce } from '../../model/IAnnonce';
/*
  Generated class for the AnnonceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AnnonceProvider implements IAnnonce {


//  list of  observable des annonces
  MesAnnonces$: FirebaseListObservable<any> = null;
  Annonce: FirebaseObjectObservable<any> = null; //   single object
  constructor(private db: AngularFireDatabase,
    public profileProvider : ProfileProvider,
    public loadingCtrl: LoadingController) {
    console.log(' AnnonceProvider Provider');
    //this.list=annonces;
    this.MesAnnonces$=db.list(`${this.profileProvider.userProfile}/Annonces`);
  }
////Récupération d'une  annonce par son ID
getAnnonce(key : string) {
  return this.Annonce=this.db.object(`${this.profileProvider.userProfile}/Annonces/${key}`, { preserveSnapshot: true })
}


//Récupération des annonces de l'utilisateur depuis firebase
	getList_des_annonce(): FirebaseListObservable<any> {

		return this.MesAnnonces$
	}
//suppression d'une  annonce par son ID
removeAnnonce(annonce :Annonce):firebase.Promise<any>{

return  this.MesAnnonces$.remove(annonce.key);
    }
/*---Ajout d'une annonce et sa photo-----------------------------------------------------------------	 */
/* Retourne une Promise 2 scénario d'ajout dans cette fonction si l'annonce possède une photo ou pas    */
/* dans le cas où elle ne possède pas de photo on ajoute une photo mock dans le cas où il y a une photo  */
/*On ajoute l’annonce, on récupère son id et on crée un emplacement de stockage de la photo  */
/*qui correspond à user/iduser/idannonce/photo et on stock le lien dans l’enregistrement annonce */


AjouterAnnonce(annonce: Annonce ): firebase.Promise<any> {
const loader = this.loadingCtrl.create({
  content:'chargement en cours...'
});
if (annonce.imageURL != null) {

  return  this.MesAnnonces$.push({
  titre : annonce.titre,
  description : annonce.description,
  categorie: annonce.categorie,
  imageURL: 'http://placehold.it/100x60?text=F3',
  location : annonce.location,

}).then(res => {
  loader.present();
firebase.storage().ref('/Users/').child(`${this.profileProvider.currentUser.uid}`).child(`${res.key}`)
  .child('Annonces.png')
  .putString(annonce.imageURL, 'base64', {contentType: 'image/png'})
  .then((savedPicture) => {
  this.MesAnnonces$.update( res , { imageURL: savedPicture.downloadURL})
   loader.dismiss();
  }
  )
  .catch(err => console.log(err))
}).catch(err => console.log(err))
 }
else {
  return this.MesAnnonces$.push({
  titre : annonce.titre,
  description : annonce.description,
  categorie: annonce.categorie,
  imageURL: '',
  location : annonce.location,})
  .then(res => {this.MesAnnonces$
    .update( res , { imageURL: 'http://placehold.it/100x60?text=F3'}) })
    .catch(err => {
    console.log(err)
  })

}
     }
//Modification d'une annonce

     ModifierAnnonce(annonce: Annonce): firebase.Promise<any> {
      throw new Error("Method not implemented.");
    }
     }
