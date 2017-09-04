import { Subscription } from 'rxjs/Subscription';
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

  sub : Subscription
  items$:  Observable<any>
 itemsSubscription : Observable<any>
  constructor(public navCtrl: NavController, public navParams: NavParams,  public profileProvider: ProfileProvider, public categorieProvider : CategorieProvider
  ,public toastCtrl:  ToastController )
  {
  //   this.profileProvider.getFavoris();

     //  this.profileProvider.getFavoris();
  //  this.categorie);
    //console.log(this.categorieProvider.categorie);


  }


   ionViewWillEnter() {

  this.items$ = this.profileProvider.getFavoris();
  this.sub= this.items$.subscribe( favoris => {
    //collect everything into one array
    let favorisIDs =  favoris.map( favori => { return favori.$key } )
    console.log(favorisIDs);
    this.itemsSubscription=  this.categorieProvider.items$.map( categories => {
      return  categories.filter( categorie => {
      return favorisIDs.includes(categorie.$key)
    }
    )

   }
   )
 }
)


     /* this.categorieProvider.getNom(item.$key).on('value', Snapshot => {
        if  (this.categorie.length< items.length) {
        this.categorie.push({key: Snapshot.key, icon:Snapshot.val().icon , nom:Snapshot.val().nom}) ;
        }

    });

   console.log(this.categorieProvider.items$);*/


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
  ngOnDestroy() {
    this.sub.unsubscribe();
      }

  AjoutFavoris(){
    this.navCtrl.push(ListesFavorisPage);
  }

  removeItem(key : string,  nom){
  this.profileProvider.RemoveFavoris(key);
  this.presentToast(nom);
  }

  presentToast(nom : string) {
  let toast = this.toastCtrl.create({
    message: 'la categorie  '+nom +' a été suprimmer de vos favoris',
    duration: 3000,
    position: 'top'
  });

  toast.onDidDismiss(() => {
  });

  toast.present();
}
}
