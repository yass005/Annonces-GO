import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AnnonceProvider } from '../../providers/annonce/annonce';
import { AjoutAnnoncePage } from '../ajout-annonce/ajout-annonce';
import { Annonce } from '../../model/annonce';
import { AnnonceDetailsPage } from '../annonce-details/annonce-details';
@Component({
  selector: 'page-page2',
  templateUrl: 'page2.html'
})
export class Page2 {
  selectedItem: any;
  icons: string[];
  items: Annonce[]
 pushPage: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public  Annonces : AnnonceProvider) {

    this.items=Annonces.List_des_annonces();
this.pushPage = AnnonceDetailsPage;
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(Page2, {
      item: item
    });
  }

 AjoutAnnonce() {

    this.navCtrl.push(AjoutAnnoncePage);
    }

}
