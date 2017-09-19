/*---------------------------Service pour authetification-------------------------  */
/* Service AuthProvider qui gère les fonction de connexion en utilisant angularfire2*/
/*ce service permet d'avoir de Surveiller l'état d'authentification en temps réel   */
/* AngularFireAuth.authState fournit un <Firebase.User> observable pour surveiller  */
/* l'état d'authentification de notre application L'AngularFireAuth comporte        */
/* différentes méthodes de connexion* ce service a impélemter 3 mode emailLogin,    */
/*Facebook, Google PlusPlus ..                                                      */
/*---------------------------------------------------------------------------------*/
/*importe des interface de la bibliothèque Angular de '@angular/core', plugins Cordova
/*  Modules angularfire2 necessaires */
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireDatabaseModule, } from 'angularfire2/database';
import firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import { Observable } from 'rxjs/Rx';
import { Firebase } from '@ionic-native/firebase';
import { IAuthSytem } from "../../model/IAuthSystem";
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthProvider implements IAuthSytem {
  public authState: firebase.User;

  // premier solution connexion réseau social
  /*providerFacebook = new firebase.auth.FacebookAuthProvider();
  providerGoogle = new firebase.auth.GoogleAuthProvider();*/
  public user: Observable<firebase.User>;
  constructor(private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase,
    public firebase: Firebase,
    public googlePlus: GooglePlus, public facebook: Facebook) {
    this.user = afAuth.authState;
  }

  /*---Creation de compte  aevc email et mot de passe-----------------------------------------------*/
  //création d'un nouveau utilisateur avec un email et un password et mise a jour de email dans la base
  signupUser(email: string, password: string): firebase.Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((newUser) => {
      this.afDatabase.object(`/userProfile/${newUser.uid}`).update({
        email: email
      })
    })

  }

/*---Connexion en utilisan le mode signInAnonymously fonction demandé par le mondant mais pour ----/
/----les changement future------------------------------------------------------------------------*/
  private init(): void {
    this.afAuth.authState.subscribe((authState) => {
      if (authState === null) {
        this.afAuth.auth.signInAnonymously()
          .then((authState) => {
            this.authState = authState;
          })
          .catch((error) => {
            throw new Error(error.message);
          });
      } else {
        this.authState = authState;
      }

      console.log(authState);
    }, (error) => {
      throw new Error(error.message);
    });
  }
  // récupération de id de l'utilisateur (important pour avoir accés a son profile)
  getUser(): firebase.User {
    return this.afAuth.auth.currentUser;
  }
  //déconnexion de utilisateur
  logout() {
    this.afAuth.auth.signOut();
  }
  // envoie de l'email de récupération du mot de passe
  resetPassword(email: string): firebase.Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  //connexion avec email et mot de passe, cette fonction  retourne  une Promise l'etrreur est traité sur la vue
  loginUser(email: string, password: string): firebase.Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => { this.UpdateToken(this.afAuth.auth.currentUser.uid); })
  }
  // impossible d'utiliser authetification native une cle hash et demander et impossible de
  //la générer. Le plugin disponible génère aussi une erreur l’or du test sur émulateur ou devise
  // 24.07.2017
  // connexion avec facebook en utilisan l'accées native aprés un downgrade. des recherche on permis la résoluion

  facebookLogin(): Promise<any> {
    return this.facebook.login(['email'])
      .then((response) => {
        const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(response.authResponse.accessToken);

        return this.afAuth.auth.signInWithCredential(facebookCredential)
          .then((success) => { console.log("Firebase success: " + JSON.stringify(success)); })
          .then(() => { this.UpdateToken(this.afAuth.auth.currentUser.uid); })
          .catch((error) => { console.log("Firebase failure: " + JSON.stringify(error)); });

      })
      .catch((error) => { console.log(error) });
  }
  // connexion avec google en utilisan l'accées native au compte google
  googleLogin(): Promise<any> {
    return this.googlePlus.login({
      'webClientId': '240356183666-isqpe199edhl77u7bn5e5m847ffsokh2.apps.googleusercontent.com',
      'offline': true
    })
      .then(res => {
        const credential = firebase.auth.GoogleAuthProvider.credential(res.idToken);

        this.afAuth.auth.signInWithCredential(credential)
          .then(success => { console.log("Firebase success: " + JSON.stringify(success)); }).then(() => {
            this.UpdateToken(this.afAuth.auth.currentUser.uid);
          })
          .catch(error => console.log("Firebase failure: " + JSON.stringify(error)));
      })
      .catch(err => console.error("Error: ", err));
  }
  // fonction pour la récupération de token du device et de l'enregistrer sur le compte utilisateur pour
  //l'envois de notification cette fonction est appelé a chaque connexion. car si l'utilisateur se
  // connecte avec un autre smartphone on auras le nouveau Token
  UpdateToken(userUid): Promise<any> {

    return this.firebase.getToken()
      .then(token => {
        this.afDatabase.object(`/userProfile/${userUid}/`).update({
          token: token
        })
      }).catch(err => {
        console.log(err)
      })

  }

  /* facebookLogin() {

   return this.SocialLogin(this.providerFacebook)
 }*/
  // solution alternative trouvé en utilisan la redirection dynamik link pour la connexion social mais a la fin du premier sprint
  //j'ai investie un peu plus de temps dans la solution native et le probléme été causé par le plugin cordova facebook 4 un downgrade
  // a permis la résolution du probléme et de pouvopir profiter de la performance de l'accées native
  /* SocialLogin(provider): void{

       // this.afAuth.auth.signInWithRedirect(provider).then( () => {
       //   this.afAuth.auth.getRedirectResult().then( result => {
        // This gives you a Google Access Token.
        // You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;

        console.log(token, user);
      }).catch(function(error) {
        // Handle Errors here.
        console.log(error.message);
      });
    });
  }*/

  /*googleLogin() {

  return this.SocialLogin(this.providerGoogle);
  }*/
}



