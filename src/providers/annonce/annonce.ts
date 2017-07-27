import { Annonce } from './../../model/annonce';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { annonces } from '../../model/Annonces';
import { AngularFireDatabase, AngularFireDatabaseModule, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { AuthProvider } from '../auth/auth';
import { ProfileProvider } from '../profile/profile';

/*
  Generated class for the AnnonceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AnnonceProvider {


  list : Annonce[];
  items$: FirebaseListObservable<any> = null; //  list of objects
  item: FirebaseObjectObservable<any> = null; //   single object
  constructor(private db: AngularFireDatabase, public profileProvider : ProfileProvider) {
    console.log('Hello AnnonceProvider Provider');

    this.list=annonces;
    this.items$=db.list(`${this.profileProvider.userProfile}/Annonces`);
  }

  Ajouter_annonce(annonce: Annonce) : Boolean{
    if(annonce!=null){
    this.ADD(annonce);
    return true;
    }
    return false;
  }

  List_des_annonces(){

    return annonces;

}

    removeAnnonce(annonce :Annonce): Boolean{

         const position = annonces.indexOf(annonce);

         if(position>=0){
         annonces.splice(position,1);
          return true;
    }
    return false;

    }

     ADD(annonce: Annonce ): void {
  // Writes user name and email to realtime db
  // useful if your app displays information about users or for admin features

this.items$.push({

  titre : annonce.titre,
  description : annonce.description,
  categorie: annonce.categorie,
  imageURL: 'http://placehold.it/100x60?text=F3',
  location : annonce.location


}).then(res => {
  console.log(res);
}, err => console.log(err))

}



}
