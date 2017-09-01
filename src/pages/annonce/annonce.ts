import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Annonce } from '../../model/annonce';
import { Observable } from 'rxjs/Rx';
import { CategorieProvider } from '../../providers/categorie/categorie';
import { EmailComposer } from '@ionic-native/email-composer';
import firebase from 'firebase'
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { Loc } from '../../model/location';
import { ProfileProvider } from '../../providers/profile/profile';
import { Subscription } from 'rxjs/Subscription';

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
  userPosition: Loc
  contienposition: boolean=true;
  sub : Subscription
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private launchNavigator: LaunchNavigator,
private profileProvider: ProfileProvider,
     private emailComposer: EmailComposer,
    private categorieProvider : CategorieProvider,private viewCtrl: ViewController) {
  this.itemObservable=this.categorieProvider.getAnnonce(this.navParams.get('Id'));
  this.userPosition=this.navParams.get('Position');
  console.log(this.userPosition);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnnoncePage');
  }

  ionViewDidLeave(){
    if (this.sub.unsubscribe()){
      console.log('ok');
    }

      }
 ionViewDidEnter() {
  if (this.profileProvider.currentUser)
    {
 this.sub=this.itemObservable.subscribe(snapshot => {

   if (snapshot.val() != null) {

  this.annonce=snapshot.val()
  console.log(this.annonce);
  this.annonce.key=snapshot.key
  this.annonce.location ? this.contienposition=true : this.contienposition=false;
   }
}, Error => {
  console.log(Error.message)

});
}
else{
this.sub.unsubscribe();
  }
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
navigate(Destinations: any){
  console.log(Destinations)
  this.launchNavigator.navigate(`${Destinations.Lat}, ${Destinations.Long}`, {
    start: `${this.userPosition.lat}, ${this.userPosition.lng}`
}).catch(err=> {
  console.log(err);
})

}

}
