/*-------------Menu principale des Categories  --------------------------------------*/
/*cette page représente  les Categories de l'application  et permet a l'utilisateur-*/
/*	  la navigation vers les annonces de la  categorie selectioner                 */
/*--------------------------------------------------------------------------------*/
import { annonces } from './../../model/Annonces';
import { FirebaseListObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { categorie } from '../../model/categorie';
import { CategorieProvider } from '../../providers/categorie/categorie';
import { AnnoncesParCatégoriePage } from "../annonces-par-cat\u00E9gorie/annonces-par-cat\u00E9gorie";
import { Observable } from 'rxjs/Rx';
import { Geolocation } from '@ionic-native/geolocation';
import { Loc } from '../../model/location';
import { Subscription } from 'rxjs/Subscription';
/**
 * Generated class for the ListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-list',
  templateUrl: 'categories.html',
})

export class CategoriesPage {
  categories: FirebaseListObservable<categorie[]>;
    sub : Subscription

    annoncesCount: any[] = [];
  constructor(private categorieProvider : CategorieProvider, public navCtrl: NavController,
    public navParams: NavParams) {
    this.categories = categorieProvider.items$;


  }
// au chargement de du composant on charge la liste des catégorie depuis firebase l'application
  ionViewDidEnter() {
    console.log('ionViewDidLoad ListPage');
    this.sub=this.categories.map(cats=>{
      return cats.filter(cat=>{
        return !!cat.Annonces
      }).map(cat=>{
      return {id : cat.$key, nbannonces: Object.keys(cat.Annonces).length}
    })
    }).subscribe(val=>{
      this.annoncesCount=val;
      console.log(  this.annoncesCount);
    }, Error => {
      console.log(Error.message)
    })

  }

  //navigations vers la liste des annonces de la catégorie
  GoToAnnoncesParCategorie(categorieId, categorieName ){
    this.navCtrl.push(AnnoncesParCatégoriePage, { 'CategorieId': categorieId, 'categorieName': categorieName }).catch(err => {
  console.log(err);
})
}
//fin de vie de notre  Observable
ngOnDestroy() {
  this.sub.unsubscribe();
    }

 //fin de vie de notre  Observable
    ionViewDidLeave(){
      this.sub.unsubscribe(), err => {
        console.log(err.message)
      }
      console.log('ok');

    }

    // retourne le nombre d'annonces d'une catégorie
getnbannonces(key: string){
 return this.annoncesCount.filter(item=>{
    return item.id===key
  }).map(item=>{
    return item.nbannonces
  })
}



}
