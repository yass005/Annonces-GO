import { Component } from '@angular/core';
import {Loading,
  LoadingController, IonicPage, NavController, AlertController  } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../login/login';

@IonicPage({
  name: 'profile'
})
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public userProfile:any;
  public birthDate:string;
  public userAdress:any;
  public loading: Loading;
  constructor( public loadingCtrl: LoadingController, public navCtrl: NavController, public alertCtrl: AlertController,
    public profileProvider: ProfileProvider, public authProvider: AuthProvider) {}

  ionViewDidEnter() {
    this.profileProvider.getUserProfile().on('value', userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val();
      this.birthDate = userProfileSnapshot.val().birthDate;
      this.userAdress=userProfileSnapshot.val().adress;
    });
  }

  logOut(): void {
this.authProvider.logout();
this.navCtrl.push(LoginPage);

  }

  updateName(){
    const alert = this.alertCtrl.create({
      message: "Your first name & last name",
      inputs: [
        {
          name: 'firstName',
          placeholder: 'Your first name',
          value: this.userProfile.firstName
        },
        {
          name: 'lastName',
          placeholder: 'Your last name',
          value: this.userProfile.lastName
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider.updateName(data.firstName, data.lastName);
          }
        }
      ]
    });
    alert.present();
  }

    updatadress(){
    const alert = this.alertCtrl.create({
      message: "Votre adress",
      inputs: [
        {
          name: 'rue',
          placeholder: 'rue',
          value: this.userAdress.rue
        },
        {
          name: 'numéro',
          placeholder: 'numéro',
         value: this.userAdress.numéro
        },
           {
          name: 'ville',
          placeholder: 'ville',
         value: this.userAdress.ville
        }
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider.updateAdresse(data.rue , data.numéro , data.ville);
          }
        }
      ]
    });
    alert.present();
  }
  updateDOB(birthDate){
    this.profileProvider.updateDOB(birthDate);
  }

  updateEmail(){
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newEmail',
          placeholder: 'Your new email',
        },
        {
          name: 'password',
          placeholder: 'Your password',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            let newEmail = data.newEmail;

            this.profileProvider.updateEmail(data.newEmail, data.password).then( ()=> {
          this.loading.dismiss().then(() => {
            console.log("mail modifier")
          });
        }, error => {
          this.loading.dismiss().then(() => {
            let alert = this.alertCtrl.create({
              message: error.message,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          });
        });
      this.loading = this.loadingCtrl.create();
      this.loading.present();
          }
        }
      ]
    });
    alert.present();
  }

  updatePassword(){
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newPassword',
          placeholder: 'Your new password',
          type: 'password'
        },
        {
          name: 'oldPassword',
          placeholder: 'Your old password',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {

          this.profileProvider.updatePassword(data.newPassword, data.oldPassword)
        .then ( () => {

          this.loading.dismiss().then(() => {
              let alert = this.alertCtrl.create({
              message: "mot de pass bien modifier",
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
            alert.present();
             console.log("mot de passe modifier")
          });


        }, error => {
          this.loading.dismiss().then(() => {
            let alert = this.alertCtrl.create({
              message: error.message,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          });
        });
      this.loading = this.loadingCtrl.create();
      this.loading.present();
          }
        }
      ]
    });
    alert.present();
  }

   Delteuser(){
    let alert = this.alertCtrl.create({
       message: "vous veuiller saisir votre mot de pass",
      inputs: [

        {
          name: 'Password',
          placeholder: 'Your password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider.DeleteUser(data.Password).then ( () => {
          this.loading.dismiss().then(() => {
            console.log("mail modifier")
          });
        }, error => {
          this.loading.dismiss().then(() => {
            let alert = this.alertCtrl.create({
              message: error.message,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          });
        });
      this.loading = this.loadingCtrl.create();
      this.loading.present();
          }
        }
      ]
    });
    alert.present();
  }

}
