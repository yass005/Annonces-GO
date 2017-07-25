import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Annonce } from '../../model/annonce';

/**
 * Generated class for the AnnonceDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-annonce-details',
  templateUrl: 'annonce-details.html',
})
export class AnnonceDetailsPage {
annonce : Annonce
  constructor(public navCtrl: NavController, public navParams: NavParams) {
     this.annonce=this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnnonceDetailsPage');
  }
share(annonce){

}
}
