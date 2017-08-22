import { FirebaseListObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { categorie } from '../../model/categorie';
import { CategorieProvider } from '../../providers/categorie/categorie';
import { AnnoncesParCatégoriePage } from "../annonces-par-cat\u00E9gorie/annonces-par-cat\u00E9gorie";
/**
 * Generated class for the ListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {
  items: FirebaseListObservable<categorie[]>;
  constructor(private categorieProvider : CategorieProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.items = categorieProvider.items$;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
  }

  goToEventDetail(categorieId){
this.navCtrl.push(AnnoncesParCatégoriePage, { 'CategorieId': categorieId });
}

}
