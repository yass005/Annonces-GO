import { AnnoncePage } from './../annonce/annonce';
import { FirebaseListObservable } from 'angularfire2/database';
import { CategorieProvider } from './../../providers/categorie/categorie';
import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { GeolocationProvider } from '../../providers/geolocation/geolocation';

import { Annonce } from '../../model/annonce';
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
  annonces: FirebaseListObservable<Annonce[]>;
  searchQuery: string;
  public ALLAnnonces : Annonce[];
  filtredAnnonce: Annonce[];
  sub : Subscription
  constructor(private categorieProvider : CategorieProvider,
     private modalCtrl: ModalController,
    public navCtrl: NavController, public navParams: NavParams) {

    this.sub=this.categorieProvider.findAllAnnonces()
    .subscribe(
      value => {
        console.log(value)
        this.ALLAnnonces = this.filtredAnnonce=value
    }
       , Error => {
        console.log(Error.message)

      }
       );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecherchePage');
  }


    ngOnDestroy() {
      this.sub.unsubscribe();
        }

  search(text ){

        this.filtredAnnonce= this.ALLAnnonces.filter(Annonce => Annonce.titre.includes(text));
      }

      onOpenMap(key: string) {
        const modal = this.modalCtrl.create(AnnoncePage,
          { Id: key });

        modal.present();

      }

}
