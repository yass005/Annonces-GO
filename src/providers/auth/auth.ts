import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase/app';
import { Facebook } from '@ionic-native/facebook';
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthProvider {
erreur: any;
  providerFacebook = new firebase.auth.FacebookAuthProvider();
  providerGoogle = new firebase.auth.GoogleAuthProvider();
  constructor(private afAuth: AngularFireAuth, private afDatabase : AngularFireDatabase,  public facebook: Facebook) { }

 signupUser(email: string, password: string): firebase.Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((newUser) => {
      this.afDatabase.object(`/userProfile/${newUser.uid}`).set({
          email: email
      });
    })
  }
// impossible d'utiliser authetification native une cle hash et demander et impossible de la générer
 /* facebookLogin(): Promise<any> {
    return this.facebook.login(['email'])
      .then( (response) => {
        const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(response.authResponse.accessToken);

        this.afAuth.auth.signInWithCredential(facebookCredential)
        .then((success) => { console.log("Firebase success: " + JSON.stringify(success)); })
        .catch((error) => { console.log("Firebase failure: " + JSON.stringify(error)); });

      })
      .catch((error) => { console.log(error) });
  }*/


  getUser(): firebase.User {
    return this.afAuth.auth.currentUser;
  }

  logout() {
    this.afAuth.auth.signOut();
  }

resetPassword(email: string):firebase.Promise<any> {
return this.afAuth.auth.sendPasswordResetEmail(email);
}

  loginUser(email: string, password: string): firebase.Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  googleLogin():void {

this.SocialLogin(this.providerGoogle);
}
  faceLogin(): void {

  this.SocialLogin(this.providerFacebook)
}

 SocialLogin(provider): void {

  firebase.auth().signInWithRedirect(provider).then( () => {
    firebase.auth().getRedirectResult().then( result => {
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
}
}



