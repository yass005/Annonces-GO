import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Annonce } from '../../model/annonce';
import { Observable } from 'rxjs/Rx';
import { CategorieProvider } from '../../providers/categorie/categorie';
import { EmailComposer } from '@ionic-native/email-composer';
import firebase from 'firebase'
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
  constructor(public navCtrl: NavController, public navParams: NavParams,
     private emailComposer: EmailComposer,
    private categorieProvider : CategorieProvider,private viewCtrl: ViewController) {
  this.itemObservable=this.categorieProvider.getAnnonce(this.navParams.get('Id'));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnnoncePage');
  }

 ionViewDidEnter() {
 this.itemObservable.subscribe(snapshot => {

   if (snapshot.val() != null) {

  this.annonce=snapshot.val()
  console.log(this.annonce);
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

email(key, titre)
{
  let mail: string
  firebase.database().ref(`/userProfile/${key}/email`).once('value').then( snapshot=> {
    mail= snapshot.val();
    console.log(mail)
  }).then(()=> {
      let email = {
        to: mail,
        cc: '',
        subject: titre,
        body: '',
        isHtml: true
      };
      this.emailComposer.open(email);
    }
  ).catch(err=> {
    console.log(err)
  })
}
}
