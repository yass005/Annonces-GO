import { ListPage } from './../list/list';
import { ProfilePage } from './../profile/profile';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../map/home';

/**
 * Generated class for the MenuPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({

  selector: 'page-menu',
  templateUrl: 'menu.html',
})


export class MenuPage {

  tab1Root = ProfilePage;
  tab2Root = ListPage;
  tab3Root = HomePage;

  constructor() {

  }
}
