import { AjoutAnnoncePage } from './../ajout-annonce/ajout-annonce';
/*------------------------ Page détail de l'annonce d'un utilisateur  ----------------------*/
/*	dans cette permet l'affichage du des détails d'une annonce apartenant a un utilisateur */
/*	 et  permet a l'utilisateur  de suprimmer, partager                                   */
/*     la modification n'a pas pue être déveloper                                       */
/*----------------------------------------------------------------------------------*/
import { Observable } from 'rxjs/Rx';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Annonce } from '../../model/annonce';
import { AnnonceProvider } from '../../providers/annonce/annonce';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Subscription } from 'rxjs/Subscription';
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
  sub: Subscription
  itemObservable: Observable<any>
  public annonce: Annonce;
  constructor(public navCtrl: NavController, public navParams: NavParams, public annonceProvider: AnnonceProvider,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private socialSharing: SocialSharing) {
    this.itemObservable = this.annonceProvider.getAnnonce(this.navParams.get('AnnoncesId'));

  }

  ionViewDidLoad() {

    this.sub = this.itemObservable.subscribe(snapshot => {

      if (snapshot.val() != null) {

        this.annonce = snapshot.val()
        this.annonce.key = snapshot.key
        console.log(this.annonce);
      }
    }, Error => {
      console.log(Error.message)

    });
    console.log('ionViewDidLoad AnnonceDetailsPage');
  }


  // cette méthode fais appel au plugin de partage social de l'annonce
  share() {
    this.socialSharing.share(this.annonce.titre, this.annonce.description, this.annonce.imageURL, "A URL to share").then(() => {
      console.log("shareSheetShare: Success");
    }).catch(() => {
      console.error("shareSheetShare: failed");
    });
  }
  //fin de vie de notre  Observable
  ngOnDestroy() {
    this.sub.unsubscribe();
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

  // Toast de confirmations de la supression
  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Annonce supprimée',
      duration: 2000,
      position: 'top'
    });
    toast.onDidDismiss(() => {

      this.navCtrl.pop();
    });
    toast.present();
  }


  //supression avec un modal de confirmations
  SupprimerAnnonce(annonce: Annonce) {
    let alert = this.alertCtrl.create({
      title: 'Supprimer  cette annonce ',
      message: 'Êtes-vous sûr de vouloir supprimer définitivement cette annonce  ? ',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Oui',
          handler: () => {
            this.annonceProvider.removeAnnonce(annonce).then(resole => {
              return resole
            }).then(resole => {
              this.presentToast();
            }).catch(err => {
              console.log(err);
            })

          }
        }
      ]
    });
    alert.present();
  }

  Modifier() {
    this.navCtrl.push(AjoutAnnoncePage,{ 'Annonce': this.annonce})
   /* let alert = this.alertCtrl.create({
      title: 'Non disponible ',
      message: 'Cette fonctionalité non disponible',
      buttons: ['ok']
    })

    alert.present();*/
  }
}
