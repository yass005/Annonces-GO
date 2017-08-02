import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Page2 } from '../pages/page2/page2';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth'
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { RegisterPage } from '../pages/register/register';
import { LoginPage } from '../pages/login/login';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { ProfileProvider } from '../providers/profile/profile';
import { ProfilePage } from '../pages/profile/profile';
import { AuthServiceMock } from '../providers/auth-service-mock/auth-service-mock';
import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import { AnnonceProvider } from '../providers/annonce/annonce';
import { AjoutAnnoncePage } from '../pages/ajout-annonce/ajout-annonce';
import { AnnonceDetailsPage } from '../pages/annonce-details/annonce-details';
import { Camera } from '@ionic-native/camera';
import { CategorieProvider } from '../providers/categorie/categorie';
import { CategoriesComponent } from '../components/categories/categories';

export const firebaseConfig = {
  apiKey: "AIzaSyB6s6vyLqyo9EaN2xqDpHa0WBu4tKFzwgo",
    authDomain: "annonces-go.firebaseapp.com",
    databaseURL: "https://annonces-go.firebaseio.com",
    projectId: "annonces-go",
    storageBucket: "annonces-go.appspot.com",
    messagingSenderId: "240356183666"
};

class CameraMock extends Camera {
  getPicture(options){
    return new Promise( (resolve, reject) => {
     resolve("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");
    });
  }
}
@NgModule({
  declarations: [
    MyApp,
    Page2,
    RegisterPage,
    LoginPage,
    ResetPasswordPage,
    ProfilePage,
    AjoutAnnoncePage,
    AnnonceDetailsPage,
    CategoriesComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {}, { links: [] }),
     AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page2,
    RegisterPage,
    LoginPage,
      ResetPasswordPage,
        AnnonceDetailsPage,
ProfilePage,
AjoutAnnoncePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    ProfileProvider,
    AuthServiceMock,
    BackgroundGeolocation,
    Geolocation,
    Facebook,
    NativeGeocoder,
    GooglePlus,
    LocationTrackerProvider,
   // Camera,
    { provide: Camera, useClass: CameraMock},
    AnnonceProvider,
    CategorieProvider,

  ]
})
export class AppModule { }
