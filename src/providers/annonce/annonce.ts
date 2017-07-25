import { Annonce } from './../../model/annonce';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { annonces } from '../../model/Annonces';


/*
  Generated class for the AnnonceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AnnonceProvider {
list : Annonce[];
  constructor() {
    console.log('Hello AnnonceProvider Provider');

    this.list=annonces;
  }

  Ajouter_annonce(annonce: Annonce) : Boolean{
    if(annonce!=null){
    annonces.push(annonce);
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

}
