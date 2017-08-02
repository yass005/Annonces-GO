import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireDatabaseModule, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import 'rxjs/add/operator/map';

/*
  Generated class for the CategorieProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CategorieProvider {
  items$: FirebaseListObservable<any> = null; //  list of objects
  constructor(public db:AngularFireDatabase) {
  this.items$=db.list('categories')
  }

}
