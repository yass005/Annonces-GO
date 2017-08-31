import { AnnoncePage } from './../annonce/annonce';
import { FirebaseListObservable } from 'angularfire2/database';
import { CategorieProvider } from './../../providers/categorie/categorie';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

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
  sub : Subscription
  constructor(private categorieProvider : CategorieProvider,
     private modalCtrl: ModalController,
    public navCtrl: NavController, public navParams: NavParams) {

    this.sub=this.categorieProvider.findAllAnnonces().do(console.log)
    .subscribe(
       value => this.ALLAnnonces = this.filtred=value
       );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecherchePage');
  }

  ionViewDidLeave(){
  this.sub.unsubscribe();
      console.log('ok');
    }



  search(text ){

        this.filtred= this.ALLAnnonces.filter(Annonce => Annonce.titre.includes(text));
      }

      onOpenMap(key: string) {
        const modal = this.modalCtrl.create(AnnoncePage,
          { Id: key });

        modal.present();

      }

}
