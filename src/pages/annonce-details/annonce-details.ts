import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Annonce } from '../../model/annonce';
import { AnnonceProvider } from '../../providers/annonce/annonce';
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
  constructor(public navCtrl: NavController, public navParams: NavParams,public annonceProvider :AnnonceProvider, private toastCtrl: ToastController) {
     this.annonce=this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnnonceDetailsPage');
  }
share(annonce){

}

suprimmer(annonce : Annonce){

  this.annonceProvider.removeAnnonce(annonce);
 this.presentToast();
}

presentToast() {
  let toast = this.toastCtrl.create({
    message: 'Annonces was  successfully deleted',
    duration: 2000,
    position: 'top'
  });

  toast.onDidDismiss(() => {
   this.navCtrl.pop();
  });

  toast.present();
}
}
