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

export const firebaseConfig = {
  apiKey: "AIzaSyB6s6vyLqyo9EaN2xqDpHa0WBu4tKFzwgo",
    authDomain: "annonces-go.firebaseapp.com",
    databaseURL: "https://annonces-go.firebaseio.com",
    projectId: "annonces-go",
    storageBucket: "annonces-go.appspot.com",
    messagingSenderId: "240356183666"
};

@NgModule({
  declarations: [
    MyApp,
    Page2,
    RegisterPage,
    LoginPage,
    ResetPasswordPage,
    ProfilePage


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
ProfilePage
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
    LocationTrackerProvider
  ]
})
export class AppModule { }
