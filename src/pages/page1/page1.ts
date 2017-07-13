import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {
 displayName;

  constructor(public navCtrl: NavController, private authProvider : AuthProvider) {


  }


signInWithFacebook() {
  // this.authProvider.loginWithFacebook();
  }
 signOut() {
      this.authProvider.logout();
  }
}
