/*--------------------------- Page  annonce   --------------------------------    */
/*	dans cette page permet de voir les détails   */
/*------------------------------------------------------------------------------------      */
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Annonce } from '../../model/annonce';
import { Observable } from 'rxjs/Rx';
import { CategorieProvider } from '../../providers/categorie/categorie';
import { EmailComposer } from '@ionic-native/email-composer';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { Loc } from '../../model/location';
import { ProfileProvider } from '../../providers/profile/profile';
import { Subscription } from 'rxjs/Subscription';
import { GeolocationProvider } from '../../providers/geolocation/geolocation';
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
  public annonce: Annonce;
  contienposition: boolean = true;
  sub: Subscription
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private GeolocationService: GeolocationProvider,
    private launchNavigator: LaunchNavigator,
    private profileProvider: ProfileProvider,
    private emailComposer: EmailComposer,
    private categorieProvider: CategorieProvider, private viewCtrl: ViewController) {

    //id recupéré depuis la navigation
    this.itemObservable = this.categorieProvider.getAnnonce(this.navParams.get('Id'));

    console.log(this.GeolocationService.UserPosition);


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnnoncePage');
  }

  ionViewDidLeave() {
   this.sub.unsubscribe()
      console.log('ok');


  }
  ionViewDidEnter() {

    this.sub = this.itemObservable.subscribe(snapshot => {

      if (snapshot.val() != null) {

        this.annonce = snapshot.val()
        console.log(this.annonce);
        this.annonce.key = snapshot.key
        this.annonce.location ? this.contienposition = true : this.contienposition = false;
      }
    }, Error => {
      console.log(Error.message)

    });


  }

 // retour a la page précédente
  onAbort() {
    this.viewCtrl.dismiss();
  }


  //contact par mail
  email(key, titre) {
    this.profileProvider.GetEmail(key).then(result => {
      return result
    }).then(res => {
      let mail = res.val();
      console.log(mail)
      return mail
    }).then(mail => {
      let email = {
        to: mail,
        cc: '',
        subject: titre,
        body: '',
        isHtml: true
      };
      return this.emailComposer.open(email);
    }
      ).catch(err => {
        console.log(err)
      })
  }

  //navigations gps
  navigate() {

    this.launchNavigator.navigate(`${this.annonce.location.lat}, ${this.annonce.location.lng}`, {
      start: `${this.GeolocationService.UserPosition.lat}, ${this.GeolocationService.UserPosition.lng}`
    }).catch(err => {
      console.log(err);
    })

  }
  //destructor
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
