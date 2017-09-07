import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Page2 } from '../pages/page2/page2';
import { LoginPage} from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { AngularFireAuth } from 'angularfire2/auth';
import { MenuPage } from '../pages/menu/menu';
import { TestPage } from '../pages/test/test';
import { AnnoncePage } from '../pages/annonce/annonce';
import { Firebase } from '@ionic-native/firebase';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild('myNav') navCtrl: NavController;
  rootPage: any ;



  constructor(public platform: Platform, public statusBar: StatusBar,
    private firebase: Firebase,
    public modalCtrl: ModalController,
    public splashScreen: SplashScreen,public afAuth : AngularFireAuth) {


      this.platform.ready().then(() => {
     afAuth.authState.subscribe( user  => {
      if (user ){
        this.navCtrl.setRoot(MenuPage);
      } else {
        this.navCtrl.setRoot(LoginPage);
      }
    });

    firebase.onNotificationOpen().subscribe( data => {
      console.log(JSON.stringify(data))
 // api map  AIzaSyBorIC0Qj6l5qDQyVz5ArBSPaTI62KzICI
 // ionic cordova plugin add https://github.com/mapsplugin/cordova-plugin-googlemaps#multiple_maps --variable API_KEY_FOR_ANDROID="AIzaSyBorIC0Qj6l5qDQyVz5ArBSPaTI62KzICI"
      if(data.wasTapped){

    //  authUnsubscribe.unsubscribe();
      //Notification was received on device tray and tapped by the user.
      console.log( JSON.stringify(data) );
      this.navCtrl.push(AnnoncePage, { 'Id': data.AnnonceId});

      //modal.present();
      //this.navCtrl.setRoot(AnnoncePage, { 'Id': data.AnnonceId});
      }else{
      //Notification was received in foreground. Maybe the user needs to be
     // notified.
      console.log( JSON.stringify(data) );
      this.navCtrl.push(AnnoncePage, { 'Id': data.AnnonceId});
      }
      });



      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    }
}
