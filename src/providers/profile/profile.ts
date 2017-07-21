import { Injectable } from '@angular/core';
import firebase from 'firebase'

/*
  Generated class for the ProfileProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ProfileProvider {
  public userProfile: firebase.database.Reference;
  public currentUser: firebase.User;

  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.userProfile = firebase.database().ref(`/userProfile/${user.uid}`);
      }
    });
  }

  getUserProfile(): firebase.database.Reference {
    return this.userProfile;
  }

  updateName(firstName: string, lastName: string): firebase.Promise<void> {
    return this.userProfile.update({
      firstName: firstName,
      lastName: lastName,
    });
  }

  updatePosition(lat: number, long: number): firebase.Promise<void> {
    var hopperRef = this.userProfile.child("position");
    return hopperRef.update({
      Lat: lat,
      Long: long,
    });

  }

   updateAdresse(rue: string, num : number,  ville: string): firebase.Promise<void> {
    var hopperRef = this.userProfile.child("adress");
    return hopperRef.update({
       numéro: num,
       rue: rue,
      ville: ville
    }).then(res => console.log(res)).
    catch(err => console.log(err))

  }

  updateDOB(birthDate: string): firebase.Promise<any> {
    return this.userProfile.update({
      birthDate: birthDate,
    });
  }

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

  updatePassword(newPassword: string, oldPassword: string): firebase.Promise<any> {

    const credential = firebase.auth.EmailAuthProvider.credential(this.currentUser.email, oldPassword);

  return this.currentUser.reauthenticateWithCredential(credential).then(user => {
    console.log('user loged ok');
      return   this.currentUser.updatePassword(newPassword).then(user => {
        console.log("Password Changed");
      })
  });
  /*, error => {
         console.log(error);
      }*/
  }

  DeleteUser(Password: string): firebase.Promise<any> {
    const credential = firebase.auth.EmailAuthProvider.credential(this.currentUser.email, Password);

    return this.currentUser.reauthenticateWithCredential(credential).then(user => {
      this.currentUser.delete().then( message => {
        console.log("User deleted");
      }, error => {
        console.log(error);
      });
    });
  }


}








