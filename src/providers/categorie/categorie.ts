/*---------------------------Service pour Les categories-------------------------         */
/* Service CategorieProvider qui gère les categories en  utilisant angularfire2          */
/*ce service permet de récupérer une reference depuis firebase de la liste              */
/* des categories FirebaseListObservable. fournit une liste  observable des categories */
/*---------------------------------------------------------------------------------   */
import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import 'rxjs/add/operator/map';
import { categorie } from '../../model/categorie';
import firebase from 'firebase'
import { Annonce } from '../../model/annonce';
import { ICategorie } from "../../model/ICategorie";


/*
  Generated class for the CategorieProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CategorieProvider implements ICategorie {
  //  categorie: categorie
  items$: FirebaseListObservable<any[]> = null; //  list of objects
  constructor(public db: AngularFireDatabase) {
    this.items$ = db.list('categories')
  }

  //récupération d'une catégorie
  getNom(key: string) {
    return firebase.database().ref(`categories/${key}/`);

  }
  //Lise des Annonce d'une categorie ou key repérsente id categorie
  GetAnnoncesParCatégoriePage(key: string): FirebaseListObservable<Annonce[]> {
    return this.db.list('Annonces', {
      query: {
        orderByChild: 'categorie',
        equalTo: key
      }
    })

  }

  //récupération d'une annonce depuis la liste public des annonces validé par administrateur
  getAnnonce(key: string): FirebaseObjectObservable<Annonce> {
    return this.db.object(`Annonces/${key}`, { preserveSnapshot: true })
  }

  ///Lise des Annonce validé par administrateur
  findAllAnnonces(): FirebaseListObservable<Annonce[]> {

    return this.db.list('Annonces')
  }



}
