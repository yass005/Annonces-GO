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
  templateUrl: 'list.html',
})
export class ListPage {
   items: FirebaseListObservable<any[]>;
    sub : Subscription

  annoncesCount:  any[] = [];
  constructor(private categorieProvider : CategorieProvider, public navCtrl: NavController,
    public navParams: NavParams) {
    this.items = categorieProvider.items$;



  }
  ionViewDidLeave(){
    if (this.sub.unsubscribe()){
      console.log('ok');
    }

      }
  ionViewDidEnter() {
    console.log('ionViewDidLoad ListPage');
    this.sub=this.items.map(cats=>{
      return cats.filter(cat=>{
        return !!cat.Annonces
      }).map(cat=>{
      return {id : cat.$key, nbannonces: Object.keys(cat.Annonces).length}
    })
    }).subscribe(val=>{
      this.annoncesCount=val;
      console.log(  this.annoncesCount);
    })

  }

  goToEventDetail(categorieId){
this.navCtrl.push(AnnoncesParCatégoriePage, { 'CategorieId': categorieId }).catch(err => {
  console.log(err);
})
}


getnbannonces(key: string){
 return this.annoncesCount.filter(item=>{
    return item.id===key
  }).map(item=>{
    return item.nbannonces
  })
}



}
