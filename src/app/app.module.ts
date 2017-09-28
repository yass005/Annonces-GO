/*---------------------------AppModule  -------------------------   */
/* le root module de l'application  nommé par convention AppModule */
/*----------------------------------------------------------------*/
/*import des différents plugin,services et composants  */
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { MesAnnonces } from '../pages/MesAnnonces/MesAnnonces';
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
import { ListesFavorisPage } from '../pages/listes-favoris/listes-favoris';
import { MesFavorisPage } from '../pages/mes-favoris/mes-favoris';
import { SocialSharing } from '@ionic-native/social-sharing';
import { MenuPage } from '../pages/menu/menu';
import { GoogleMaps } from '@ionic-native/google-maps';
import { HomePage } from '../pages/map/home';
import { AnnoncesParCatégoriePage } from "../pages/annonces-par-cat\u00E9gorie/annonces-par-cat\u00E9gorie";
import { AnnoncePage } from '../pages/annonce/annonce';
import { RecherchePage } from '../pages/recherche/recherche';
import { AproposPage } from '../pages/apropos/apropos';
import { EmailComposer } from '@ionic-native/email-composer';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { GeolocationProvider } from '../providers/geolocation/geolocation';
import { Firebase } from '@ionic-native/firebase';
import { firebaseConfig } from '../environments/firebase.config';
import { CategoriesPage } from '../pages/Categories/categories';




@NgModule({
  /*declarations – Dans cette propriété,   on déclare les classes
   de vue de notre module.(components, directives et pipes);*/
  declarations: [
    MyApp,
    MesAnnonces,
    RegisterPage,
    LoginPage,
    ResetPasswordPage,
    ProfilePage,
    AjoutAnnoncePage,
    AnnonceDetailsPage,
    ListesFavorisPage,
    MesFavorisPage,
    MenuPage,
    CategoriesPage,
    AproposPage,
    HomePage,
    AnnoncePage,
    AnnoncesParCatégoriePage,
    RecherchePage

  ],

  /*imports – Cette propriété permet de déclarer les modules dont dépend notre module;*/
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {}, { links: [] }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  // bootstrap – Définit le root component qui contiendra l'ensemble des autres components. Seul le root module peut déclarer cette propriété;
  bootstrap: [IonicApp],
  /* entryComponents – Cette propriété permet de déclarer tous les components qui sont chargés impérativement,
    c'est-à-dire dynamiquement sans être déclarés dans un template. */
  entryComponents: [
    MyApp,
    MesAnnonces,
    RegisterPage,
    LoginPage,
    HomePage,
    RecherchePage,
    ResetPasswordPage,
    ListesFavorisPage,
    MesFavorisPage,
    AproposPage,
    MenuPage,
    CategoriesPage,
    AnnoncePage,
    AnnoncesParCatégoriePage,
    AnnonceDetailsPage,
    ProfilePage,
    AjoutAnnoncePage
  ],
  /*
 providers – Dans cette propriété, on  déclare les services et les plugins
  ces derniers contribueront à alimenter la collection globlale
   des services accessibles par tous les composants de l'application;
   */
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    ProfileProvider,
    BackgroundGeolocation,
    EmailComposer,
    Geolocation,
    LaunchNavigator,
    GoogleMaps,
    Firebase,
    Facebook,
    NativeGeocoder,
    GooglePlus,
    LocationTrackerProvider,
    Camera,
    AnnonceProvider,
    SocialSharing,
    CategorieProvider,
    GeolocationProvider,


  ]
})
export class AppModule { }
