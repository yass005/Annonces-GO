import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireDatabaseModule,  } from 'angularfire2/database';
import firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import { Observable } from 'rxjs/Rx';
import { FCM } from '@ionic-native/fcm';
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthProvider {
  erreur: any;

  // premier solution connexion réseau social
  /*providerFacebook = new firebase.auth.FacebookAuthProvider();
  providerGoogle = new firebase.auth.GoogleAuthProvider();*/
  public   user: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth, private afDatabase : AngularFireDatabase,
    public fcm: FCM,
    public googlePlus : GooglePlus, public facebook : Facebook) {
    this.user = afAuth.authState;
  }
//création d'un nouveau utilisateur avec email e mot de passe et mise a jour de email dans la base
 signupUser(email: string, password: string): firebase.Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((newUser) => {
      this.afDatabase.object(`/userProfile/${newUser.uid}`).update({
          email: email
      })
    })

  }



// récupération de id de utilisateur (important pour avoir accés a son profile)
  getUser(): firebase.User {
    return this.afAuth.auth.currentUser;
  }
//déconnexion de utilisateur
  logout() {
    this.afAuth.auth.signOut();
  }
// envoie de l'email de récupération du mot de passe
resetPassword(email: string):firebase.Promise<any> {
return this.afAuth.auth.sendPasswordResetEmail(email);
}

  loginUser(email: string, password: string): firebase.Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then(()=> { this.updateToker(this.afAuth.auth.currentUser.uid);})
  }
// impossible d'utiliser authetification native une cle hash et demander et impossible de
//la générer le plugin disponible genere aussi une erreur lor du  tests ur emulateur ou device
// 24.07.2017
// connexion avec facebook en utilisan l'accées native a appli
  facebookLogin(): Promise<any> {
    return this.facebook.login(['email'])
      .then( (response) => {
        const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(response.authResponse.accessToken);

        this.afAuth.auth.signInWithCredential(facebookCredential)
        .then((success) => { console.log("Firebase success: " + JSON.stringify(success)); })
        .then(()=> { this.updateToker(this.afAuth.auth.currentUser.uid);})
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
    .then( res => {
      const credential = firebase.auth.GoogleAuthProvider.credential(res.idToken);

      this.afAuth.auth.signInWithCredential(credential)
        .then( success => { console.log("Firebase success: " + JSON.stringify(success)); }).then(()=> {
          this.updateToker(this.afAuth.auth.currentUser.uid);
        })
        .catch( error => console.log("Firebase failure: " + JSON.stringify(error)));
      })
    .catch(err => console.error("Error: ", err));
  }

  updateToker(userUid){

        this.fcm.getToken()
        .then(token => {
        this.afDatabase.object(`/userProfile/${userUid}/`).update({
        token: token
        })
      }).catch(err=> {
        console.log(err)
      })

    }

 /* faceLogin() {

  return this.SocialLogin(this.providerFacebook)
}*/
// solution alternative trouvé en utilisan la redirection dynamik link pour la connexion social mais a la fin du premier sprint
//j'ai investie un peu plus de temps dans la solution native et le probléme été causé par le plugin cordova facebook 4 un downgrade
// a permis la résolution du probléme et de pouvopir profiter de la performance de l'accées native
/* SocialLogin(provider): void{

      this.afAuth.auth.signInWithRedirect(provider).then( () => {
          this.afAuth.auth.getRedirectResult().then( result => {
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



