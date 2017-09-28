/*--------------------------- Page Favoris utilisateur  --------------------------------*/
/*	dans cette page j'ai injecter  les service de ProfileProvider  et CategorieProvider */
/*	  car au niveeau du compte utilisateur on stcoke que id de la catégorie            */
/*   le but est est de filtrer la lite des Categories avec ceux du users              */
/*----------------------------------------------------------------------------------  */

import { Subscription } from 'rxjs/Subscription';
import { Component } from '@angular/core';
import { ToastController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ListesFavorisPage } from '../listes-favoris/listes-favoris';
import { ProfileProvider } from '../../providers/profile/profile';
import { CategorieProvider } from '../../providers/categorie/categorie';
import { Observable } from 'rxjs/Rx';
import { categorie } from '../../model/categorie';
import { FirebaseListObservable } from 'angularfire2/database';

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

  sub: Subscription
  CategorieFavoris$: FirebaseListObservable<any>
  CategorieSubscription: Observable<categorie[]>
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public profileProvider: ProfileProvider,
    public categorieProvider: CategorieProvider,
    public toastCtrl: ToastController) {


  }

  //chargement de la liste des categorie filtré avec ceux du user
  ionViewDidLoad() {

    this.CategorieFavoris$ = this.profileProvider.getFavoris();
    this.sub = this.CategorieFavoris$.subscribe(favoris => {
      //collect everything into one array
      let favorisIDs = favoris.map(favori => { return favori.$key })
      console.log(favorisIDs);
      this.CategorieSubscription = this.categorieProvider.items$.map(categories => {
        return categories.filter(categorie => {
          return favorisIDs.includes(categorie.$key)
        }
        )

      }
      )
    }, err => {
      console.log(err.message)
    }
    )


  }
  //unsubscribe de la liste Categories
  ngOnDestroy() {
    this.sub.unsubscribe(), err => {
      console.log(err.message)
    }
    console.log('ok');
  }
  //navigation vers la liste des Categories pour en  Ajouter aux Favoris
  AjoutFavoris() {
    this.navCtrl.push(ListesFavorisPage);
  }


  // supression d'une Categorie de la liste des Favoris
  RemoveFavoris(key: string, nom) {
    this.profileProvider.RemoveFavoris(key).then(() => {
      this.presentToast(nom);
    }).catch(err => {
      console.log(err);
    })

  }
  //message de confirmation de la supression
  presentToast(nom: string) {
    let toast = this.toastCtrl.create({
      message: 'la categorie  ' + nom + ' a été suprimmer de vos favoris',
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }
}
