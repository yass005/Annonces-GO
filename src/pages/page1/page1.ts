import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../login/login';
import { MyApp } from '../../app/app.component';
import { ProfilePage } from '../profile/profile';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {
user: any;
  public userProfile: any = null;
constructor(public navCtrl: NavController, public auth : AuthProvider) {

  this.user = this.auth.getUser();
}

signInWithFacebook() {
  // this.authProvider.loginWithFacebook();
  }
 signOut() {
      this.auth.logout();
      this.navCtrl.setRoot(MyApp);
  }

  profile(){
this.navCtrl.push(ProfilePage)
  }
  google(){
    this.auth.googleLogin();
  }

  face(){
     this.auth.faceLogin();
  }
}
