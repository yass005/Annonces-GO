import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireDatabaseModule, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { categorie } from '../../model/categorie';
import firebase from 'firebase'
/*
  Generated class for the CategorieProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CategorieProvider {
 //  categorie: categorie
  items$: FirebaseListObservable<any> = null; //  list of objects
  constructor(public db:AngularFireDatabase) {
  this.items$=db.list('categories')
  }


  getNom(key: string)
  {
  return  firebase.database().ref(`categories/${key}/`);

  }



}
