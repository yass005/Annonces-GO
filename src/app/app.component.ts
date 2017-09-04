import { Component, ViewChild } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Page2 } from '../pages/page2/page2';
import { LoginPage} from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { AngularFireAuth } from 'angularfire2/auth';
import { MenuPage } from '../pages/menu/menu';
import { FCM } from '@ionic-native/fcm';
import { TestPage } from '../pages/test/test';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild('myNav') navCtrl: NavController;
  rootPage: any ;



  constructor(public platform: Platform, public statusBar: StatusBar,
    public fcm: FCM,
    public splashScreen: SplashScreen,public afAuth : AngularFireAuth) {
    this.initializeApp();


    const authUnsubscribe= afAuth.authState.subscribe( user  => {
      if (user ){
        this.navCtrl.setRoot( MenuPage);
      } else {
        this.navCtrl.setRoot(LoginPage);
      }
    });
    if (this.platform.is('cordova')) {
    fcm.onNotification().subscribe( data => {
      if(data.wasTapped){
      authUnsubscribe.unsubscribe();
      //Notification was received on device tray and tapped by the user.
      console.log( JSON.stringify(data) );
      this.navCtrl.setRoot('AnnoncePage', { 'Id': data.AnnonceId});
      }else{
      //Notification was received in foreground. Maybe the user needs to be
     // notified.
      console.log( JSON.stringify(data) );
      this.navCtrl.push('AnnoncePage', { 'Id': data.AnnonceId});
      }
      });
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }


}
