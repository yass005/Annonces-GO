import { FirebaseListObservable } from 'angularfire2/database';
import { CategorieProvider } from './../../providers/categorie/categorie';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RecherchePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recherche',
  templateUrl: 'recherche.html',
})
export class RecherchePage {
  items: FirebaseListObservable<any[]>;
  searchQuery: string;
  public ALLAnnonces : any[];
  filtred: any[];
  constructor(private categorieProvider : CategorieProvider,public navCtrl: NavController, public navParams: NavParams) {

    this.categorieProvider.findAllAnnonces().do(console.log)
    .subscribe(
       lessons => this.ALLAnnonces = this.filtred=lessons
       );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecherchePage');
  }

  search(text ){

        this.filtred= this.ALLAnnonces.filter(Annonce => Annonce.titre.includes(text));
      }

}
