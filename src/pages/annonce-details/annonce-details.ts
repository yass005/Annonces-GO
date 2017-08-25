import { Observable } from 'rxjs/Rx';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Annonce } from '../../model/annonce';
import { AnnonceProvider } from '../../providers/annonce/annonce';
import { SocialSharing } from '@ionic-native/social-sharing';
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
 itemObservable: Observable<any>
 public annonce: Annonce ;
  constructor(public navCtrl: NavController, public navParams: NavParams,public annonceProvider :AnnonceProvider, private toastCtrl: ToastController,
  private socialSharing: SocialSharing) {
this.itemObservable=this.annonceProvider.getAnnonce(this.navParams.get('AnnoncesId'));
console.log(this.annonce);
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


share(){
    this.socialSharing.share(this.annonce.titre, this.annonce.description, this.annonce.imageURL, "A URL to share").then(() => {
      console.log("shareSheetShare: Success");
    }).catch(() => {
      console.error("shareSheetShare: failed");
    });
}
 /* smsShare() {
    this.socialSharing.shareViaSMS("shareViaSMS", "mobile-no").then(() => {
      console.log("shareViaSMS: Success");
    }).catch(() => {
      console.error("shareViaSMS: failed");
    });
  }
  whatsappShare() {
    this.socialSharing.shareViaWhatsApp(this.annonce.description, this.annonce.imageURL, "null").then(() => {
      console.log("shareViaWhatsApp: Success");
    }).catch(() => {
      console.error("shareViaWhatsApp: failed");
    });
  }
  facebookShare() {
    this.socialSharing.shareViaFacebook(this.annonce.description, this.annonce.imageURL, "null").then(() => {
      console.log("shareViaFacebook: Success");
    }).catch(() => {
      console.error("shareViaFacebook: failed");
    });

  }

  TwitterShare() {
    this.socialSharing.shareViaTwitter(this.annonce.description, this.annonce.imageURL, "null").then(() => {
      console.log("shareViaFacebook: Success");
    }).catch(() => {
      console.error("shareViaFacebook: failed");
    });

  }*/
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
