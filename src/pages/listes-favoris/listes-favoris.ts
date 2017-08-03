import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2/database';
import { categorie } from '../../model/categorie';
import { CategorieProvider } from '../../providers/categorie/categorie';
import { ProfileProvider } from '../../providers/profile/profile';

/**
 * Generated class for the ListesFavorisPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-listes-favoris',
  templateUrl: 'listes-favoris.html',
})
export class ListesFavorisPage {

  items: FirebaseListObservable<categorie[]>;

  constructor( public profileProvider: ProfileProvider,private categorieProvider : CategorieProvider  ,public toastCtrl:  ToastController ) {
    console.log('Hello CategoriesComponent Component');
    this.items = categorieProvider.items$;

}

AddFavoris(key: string, nom){
  this.profileProvider.AddFavoris(key)
  .then(res=> this.presentToast(nom)
)
  .catch(err => console.log(err));
}
  presentToast(nom : string) {
  let toast = this.toastCtrl.create({
    message: 'la categorie  '+nom +' a été Ajouter  de vos favoris',
    duration: 3000,
    position: 'top'
  });

  toast.onDidDismiss(() => {
  });

  toast.present();
}

}
