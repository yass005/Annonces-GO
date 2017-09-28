/*--------------------------- Page de selection de CategorieFavoris  --------------------*/
/*	dans cette page j'ai injecter  les service de ProfileProvider  et CategorieProvider */
/*	  Cette page permet a l'utilisateur de rajouté des  Categories a ses favoris       */
/*     ceux qui font partie des  Categories Favoris du User sont marqué par un vue   */
/*----------------------------------------------------------------------------------*/
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2/database';
import { categorie } from '../../model/categorie';
import { CategorieProvider } from '../../providers/categorie/categorie';
import { ProfileProvider } from '../../providers/profile/profile';
import { Subscription } from 'rxjs/Subscription';
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
  sub: Subscription
  Categories: FirebaseListObservable<categorie[]>;
  favorisIDs: any
  constructor(public profileProvider: ProfileProvider, private categorieProvider:
    CategorieProvider, public toastCtrl: ToastController) {

    console.log('Hello CategoriesComponent Component');

  }

  // au chargement de du composant on charge la liste des catégories favoris de l'utilisateur et tous les catégories depuis firebase
  ionViewDidLoad() {

    this.Categories = this.categorieProvider.items$;
    this.sub = this.profileProvider.getFavoris().subscribe(favoris => {
      //collect everything into one array
      this.favorisIDs = favoris.map(favori => { return favori.$key })

    }, err => {
      console.log(err.message)
    })

    console.log(this.favorisIDs);
  }
  //fin de vie de notre  Observable
  ngOnDestroy() {
    this.sub.unsubscribe(), err => {
      console.log(err.message)
    }
    console.log('ok');
  }

  //Ajoute d'une Categorie aux Favoris du user
  AddFavoris(key: string, nom) {
    this.profileProvider.AddFavoris(key)
      .then(res => this.presentToast(nom)
      )
      .catch(err => console.log(err));
  }

  //Toast de confirmation de l'opération d'ajout
  presentToast(nom: string) {
    let toast = this.toastCtrl.create({
      message: 'la categorie  ' + nom + ' a été Ajouter  de vos favoris',
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }
  // permes de vérifier si la catégorie fais parti de ceux de l'utilisateur
  include(key: string) {

    return this.favorisIDs.includes(key);
  }

}
