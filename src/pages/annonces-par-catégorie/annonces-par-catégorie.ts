import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { Annonce } from '../../model/annonce';
import { FirebaseListObservable } from 'angularfire2/database';
import { CategorieProvider } from '../../providers/categorie/categorie';

/**
 * Generated class for the AnnoncesParCatégoriePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-annonces-par-catégorie',
  templateUrl: 'annonces-par-catégorie.html',
})
export class AnnoncesParCatégoriePage {

 items: FirebaseListObservable<Annonce[]>;
  constructor(public navCtrl: NavController, public navParams: NavParams, private categorieProvider : CategorieProvider) {
    this.items=this.categorieProvider.GetAnnoncesParCatégoriePage(this.navParams.get('CategorieId'));
    console.log(this.items);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnnoncesParCatégoriePage');
  }

}
