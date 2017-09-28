import { Component, ViewChild } from '@angular/core';
import { NavController, Platform,  ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage} from '../pages/login/login';
import { AngularFireAuth } from 'angularfire2/auth';
import { MenuPage } from '../pages/menu/menu';
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
    private toastCtrl: ToastController,
    public splashScreen: SplashScreen,public afAuth : AngularFireAuth) {


      this.platform.ready().then(() => {
     afAuth.authState.subscribe( user  => {
      if (user ){
        this.navCtrl.setRoot(MenuPage);
      } else {
        this.navCtrl.setRoot(LoginPage);
      }
    });


    //  reception des notification quand l'application est en background
    firebase.onNotificationOpen().subscribe( data => {
      console.log(JSON.stringify(data))

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
      this.presentToast()
      this.navCtrl.push(AnnoncePage, { 'Id': data.AnnonceId});

      }
      });



      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });



    }

    presentToast() {
      let toast = this.toastCtrl.create({
        message: 'Annonce à proximité',
        duration: 5000,
        position: 'top'
      });

      toast.present();
    }
}
