import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase/app';

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
  private  authState: firebase.User;

  constructor(private afAuth: AngularFireAuth, private afDatabase : AngularFireDatabase) { }
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
    }, (error) => {
      throw new Error(error.message);
    });
  }
 signupUser(email: string, password: string): firebase.Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((newUser) => {
      this.afDatabase.object(`/userProfile/${newUser.uid}`).update({
          email: email
      })
    })

  }

// impossible d'utiliser authetification native une cle hash et demander et impossible de
//la générer le plugin disponible genere aussi une erreur lor du  tests ur emulateur ou device
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

googleLogin() {

return this.SocialLogin(this.providerGoogle);
}
  faceLogin() {

  return this.SocialLogin(this.providerFacebook)
}

 SocialLogin(provider): void{

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
}
}



