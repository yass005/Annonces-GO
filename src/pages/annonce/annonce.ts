import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Annonce } from '../../model/annonce';
import { Observable } from 'rxjs/Rx';
import { CategorieProvider } from '../../providers/categorie/categorie';
/**
 * Generated class for the AnnoncePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-annonce',
  templateUrl: 'annonce.html',
})
export class AnnoncePage {
 itemObservable: Observable<any>
  public annonce: Annonce ;
  constructor(public navCtrl: NavController, public navParams: NavParams, private categorieProvider : CategorieProvider,private viewCtrl: ViewController) {
  this.itemObservable=this.categorieProvider.getAnnonce(this.navParams.get('Id'));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnnoncePage');
  }

 ionViewDidEnter() {
 this.itemObservable.subscribe(snapshot => {

   if (snapshot.val() != null) {

  this.annonce=snapshot.val()
  this.annonce.key=snapshot.key
   }
}, Error => {
  console.log(Error.message)

});

    console.log('ionViewDidLoad AnnonceDetailsPage');
  }

      onAbort(){
    this.viewCtrl.dismiss();
  }


}
