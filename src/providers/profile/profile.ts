/*---------------------Service pour a geston du profil utilisateu-----------------        */
/* Service ProfileProvider qui gère les fonction profil utilisateu------------------     */
/*ce service permet  de récupér les infos de l'utilisateur, changement de mot de pass,  */
/*d'adress mail, et des infos personels du compte utilisateur, supression de comptede  */
/*récupéré la liste  des annonces, des favoris                                        */
/*---------------------------------------------------------------------------------  */


import { Injectable } from '@angular/core';
import firebase from 'firebase'
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Rx';
import { IProfile } from "../../model/IProfile";

/*
  Generated class for the ProfileProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ProfileProvider implements IProfile {
  public userProfile: firebase.database.Reference;
  public currentUser: firebase.User;
  constructor(private db: AngularFireDatabase) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.userProfile = firebase.database().ref(`/userProfile/${user.uid}`);
      }
    });
  }

  /*---Récupération compte utilisateur----------------------------------------------
   récupérer des informations du profil  de l'utilisateur authetifie                 */
  getUserProfile(): firebase.database.Reference {
    return this.userProfile
  }

  //suppression d'une categorie des favoris
  RemoveFavoris(key: string): firebase.Promise<any> {
    return this.db.list(`/userProfile/${this.currentUser.uid}/Favoris/${key}`).remove()
      .then(() => {
        console.log('remove ok')
      })
      .catch(ERR => {
        console.log(ERR)
      })

  }
  //récupérer email d'un utilisateur
GetEmail(key : string): firebase.Promise<void>{
  return  firebase.database().ref(`/userProfile/${key}/email`).once('value');

}
  //récupérer la lite des favoris
  getFavoris(): FirebaseListObservable<any> {
    return this.db.list(`/userProfile/${this.currentUser.uid}/Favoris`);

  }

  //Modfication du nom et prénom
  updateName(firstName: string, lastName: string): firebase.Promise<void> {
    return this.userProfile.update({
      firstName: firstName,
      lastName: lastName,
    });
  }

  //Mettre à jour de la  position
  updatePosition(lat: number, lng: number): firebase.Promise<void> {
    const positionrRef = this.userProfile.child("position");
    return positionrRef.update({
      lat: lat,
      lng: lng,
    });

  }

  //Ajout d'une categorie aux favoris
  AddFavoris(key: string): firebase.Promise<void> {
    let FavorisRef = this.userProfile.child("Favoris");
    return FavorisRef.child(key).set(true);

  }
  //Modfication de l'adress
  updateAdresse(rue: string, num: number, ville: string): firebase.Promise<void> {
    const AdresseRef = this.userProfile.child("adress");
    return AdresseRef.update({
      numéro: num,
      rue: rue,
      ville: ville
    }).then(res => console.log(res))
      .catch(err => console.log(err))

  }
  //Modfication de la date de naissance
  updateDOB(birthDate: string): firebase.Promise<any> {
    return this.userProfile.update({
      birthDate: birthDate,
    }).then(res => console.log(res))
      .catch(err => console.log(err))
  }
  //Modification de l'adress email cette fonctionnalité necessité de réauthentifier le user
  updateEmail(newEmail: string, password: string): firebase.Promise<any> {
    const credential = firebase.auth.EmailAuthProvider.credential(this.currentUser.email, password);

    return this.currentUser.reauthenticateWithCredential(credential).then(user => {
      console.log('user loged ok');
      return this.currentUser.updateEmail(newEmail).then(user => {
        console.log("Password Changed");
        this.userProfile.update({ email: newEmail }).then(user => {

        })
      });
    });
  }

  //Modification du mot de passe cette fonctionnalité necessité de réauthentifier le user
  //comme pour le changement de mot de passe, une sécurité de firebase

  updatePassword(newPassword: string, oldPassword: string): firebase.Promise<any> {

    const credential = firebase.auth.EmailAuthProvider.credential(this.currentUser.email, oldPassword);

    return this.currentUser.reauthenticateWithCredential(credential).then(user => {
      console.log('user loged ok');
      return this.currentUser.updatePassword(newPassword).then(user => {
        console.log("Password Changed");
      })
    });
    /*, error => {
           console.log(error);
        }*/
  }

  //supprime le  compte utilisateur
  DeleteUser(Password: string): firebase.Promise<any> {
    const credential = firebase.auth.EmailAuthProvider.credential(this.currentUser.email, Password);
    return this.currentUser.reauthenticateWithCredential(credential).then(user => {
      this.currentUser.delete().then(message => {
        console.log("User deleted");
      }, error => {
        console.log(error);
      });
    });
  }


}








