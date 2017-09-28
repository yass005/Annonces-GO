/*--------------------------- Page Annonces de l'utilisateur  --------------------------------  */
/*	dans cette page j'ai injecter  le service de AnnonceProvider  pour la récupération         */
/*	de la liste des annonces de l'utilisateur                                                 */
/*------------------------------------------------------------------------------------       */

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AnnonceProvider } from '../../providers/annonce/annonce';
import { AjoutAnnoncePage } from '../ajout-annonce/ajout-annonce';
import { AnnonceDetailsPage } from '../annonce-details/annonce-details';
import { FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'page-MesAnnonces',
  templateUrl: 'MesAnnonces.html'
})
export class MesAnnonces {
  selectedItem: any;
  MesAnnonces: FirebaseListObservable<any[]>;
  pushPage: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public Annonces: AnnonceProvider) {

    this.MesAnnonces = Annonces.MesAnnonces$;

  }

  // Navigation vers la page d'ajout d'une annonce
  AjoutAnnonce() {
    this.navCtrl.push(AjoutAnnoncePage).then(() => {
      console.log('navigation ok')
    }).catch(err => {
      console.log(err)
    })
  }


  // Navigation vers le détail de l'annonce selectionner
  goToDetailAnnonce(AnnonceId) {
    this.navCtrl.push(AnnonceDetailsPage, { 'AnnoncesId': AnnonceId }).then(() => {
      console.log('navigation ok')
    }).catch(err => {
      console.log(err)
    })
  }

}
