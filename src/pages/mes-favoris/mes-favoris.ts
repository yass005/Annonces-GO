
import { Component } from '@angular/core';
import {ToastController, IonicPage,  NavController,  NavParams} from 'ionic-angular';
import { ListesFavorisPage } from '../listes-favoris/listes-favoris';
import { ProfileProvider } from '../../providers/profile/profile';
import { CategorieProvider } from '../../providers/categorie/categorie';
import { Observable } from 'rxjs/Rx';
import { categorie } from '../../model/categorie';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

/**
 * Generated class for the MesFavorisPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-mes-favoris',
  templateUrl: 'mes-favoris.html',
})
export class MesFavorisPage {

  item: any;
  items$: FirebaseListObservable<any[]>;

    categorie : categorie[]
  constructor(public navCtrl: NavController, public navParams: NavParams,  public profileProvider: ProfileProvider, public categorieProvider : CategorieProvider
  ,public toastCtrl:  ToastController )
  {
     this.profileProvider.getFavoris();

     //  this.profileProvider.getFavoris();
     console.log(this.profileProvider.categoriesPromises.map(data => {return data}));
  //  this.categorie);
    //console.log(this.categorieProvider.categorie);


  }

   ionViewWillEnter() {
    this.categorie=[];
   this.items$ = this.profileProvider.getFavoris();
   this.items$.subscribe( items => {
    items.forEach( item => {
      this.categorieProvider.getNom(item.$key).on('value', Snapshot => {
        if  (this.categorie.length< items.length) {
        this.categorie.push({key: Snapshot.key, icon:Snapshot.val().icon , nom:Snapshot.val().nom}) ;
        }

    });
   console.log(item.$key);
}
)
   })
  console.log(this.categorie);

    console.log('ionViewDidLoad AnnonceDetailsPage');
  }

  ionViewDidLoad() {

  }
 /*ionViewDidEnter() {
 this.itemObservable.subscribe(snapshot => {

   if (snapshot.val() != null) {

  this.annonce=snapshot.val()
  this.annonce.key=snapshot.key
   }
}, Error => {
  console.log(Error.message)

});

    console.log('ionViewDidLoad AnnonceDetailsPage');
  }*/


  AjoutFavoris(){
    this.navCtrl.push(ListesFavorisPage);
  }

  removeItem(key : string, i, nom){

    this.profileProvider.RemoveFavoris(key);
    this.categorie.splice(i,1);
  this.presentToast(nom);
  }

  presentToast(nom : string) {
  let toast = this.toastCtrl.create({
    message: 'la categorie  '+nom +' a été suprimmer de vos favoris',
    duration: 3000,
    position: 'top'
  });

  toast.onDidDismiss(() => {
this.navCtrl.pop();
  });

  toast.present();
}
}
