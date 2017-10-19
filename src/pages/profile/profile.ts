/*--------------------------- Page profil utilisateur  --------------------------------*/
/*	dans cette page j'ai injecter  le service de ProfileProvider  pour les divers     */
/*	fonctionalité de gestion de compte Utilisateur, Favoris, et Les Annonces          */
/* de se dérnier                                                                     */
/*----------------------------------------------------------------------------------*/



import { Component } from '@angular/core';
import {
  Loading,
  LoadingController, IonicPage, NavController, AlertController
} from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../login/login';
import { MesAnnonces } from '../MesAnnonces/MesAnnonces';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { ListesFavorisPage } from '../listes-favoris/listes-favoris';
import { MesFavorisPage } from '../mes-favoris/mes-favoris';
import { User } from '../../model/user';

@IonicPage({
  name: 'profile'
})
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public userProfile: User;
  public birthDate: Date;
  public userAdress: any;
  public loading: Loading;
  check: boolean = false
  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController,
    public alertCtrl: AlertController,
    public profileProvider: ProfileProvider,
    public authProvider: AuthProvider,
    public LocationTracker: LocationTrackerProvider) {

  }


  //Chargement des informations de l'utilisateur aprés chargement de la vue
  ionViewDidLoad() {
    this.profileProvider.getUserProfile().on('value', userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val();
      console.log(this.userProfile.adress);
      this.birthDate = userProfileSnapshot.val().birthDate;
      this.userAdress = this.userProfile.adress
    })
  }


  //se déconnecter de l'application
  logOut(): void {
    this.authProvider.logout();
    //this.navCtrl.setRoot(MyApp);

  }


  //fonction qui permet mettre à jour le nom et prénom et trairements des erreur
  updateName() {
    const alert = this.alertCtrl.create({
      message: "Votre nom et prénom ",
      inputs: [
        {
          name: 'Prénom',
          placeholder: 'Votre Prénom',
          value: this.userProfile.firstName
        },
        {
          name: 'Nom',
          placeholder: 'Votre  Nom',
          value: this.userProfile.lastName
        },
      ],
      buttons: [
        {
          text: 'Annuler',
        },
        {
          text: 'Enregistrer',
          handler: data => {
            this.profileProvider.updateName(data.Prénom, data.Nom)
              .then(() => {
                this.showMessage("Votre Votre nom et prénom ont été modifiés");
              }, error => {
                this.showMessage(error.message);
              });
            this.loading = this.loadingCtrl.create();
            this.loading.present();
          }
        }
      ]
    });
    alert.present();
  }
  //fonction qui permet de mettre à jour l'adress et trairements des erreur
  updatadress() {
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
          text: 'Annuler',
        },
        {
          text: 'Ok',
          handler: data => {
            console.log(data)
            this.profileProvider.updateAdresse(data.rue, data.numéro, data.ville)
              .then(() => {
                this.showMessage("Votre adresse a été modifié");

              }).catch(error => {
                this.showMessage(error.message);
              })
            this.loading = this.loadingCtrl.create();
            this.loading.present();
          }
        }
      ]
    });
    alert.present();
  }


  // mettre à jour de la date de naissance

  updateDOB(birthDate) {
    this.profileProvider.updateDOB(birthDate).then(() => {
      this.showMessage("Votre date de naissance a été modifié");
    }, error => {
      this.showMessage(error.message);
    });
    this.loading = this.loadingCtrl.create();
    this.loading.present();
  }


  // mettre à jour l'email
  updateEmail() {
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
            this.profileProvider.updateEmail(data.newEmail, data.password).then(() => {
              this.showMessage("Email bien modifier");

            }, error => {
              this.showMessage(error.message);
            });
            this.loading = this.loadingCtrl.create();
            this.loading.present();
          }
        }
      ]
    });
    alert.present();
  }
  //mettre à jour du mot de passe
  updatePassword() {
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newPassword',
          placeholder: 'Votre nouveau mot de passe',
          type: 'password'
        },
        {
          name: 'oldPassword',
          placeholder: 'votre ancien mot de passe',
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
              .then(() => {

                this.showMessage('mot de pass bien modifier');

              }, error => {

                this.showMessage(error.message);
              });

            this.loading = this.loadingCtrl.create();
            this.loading.present();
          }
        }
      ]
    });
    alert.present();
  }
  //fonction pour supprimer mon compte.
  Delteuser() {
    let alert = this.alertCtrl.create({
      message: "Veuillez saisir votre mot de passe",
      inputs: [

        {
          name: 'Password',
          placeholder: 'Votre mot de passe',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Annuler',
        },
        {
          text: 'Enregistrer',
          handler: data => {

            this.profileProvider.DeleteUser(data.Password).then(() => {
              this.showMessage("user deleted");
            }, error => {
              this.showMessage(error.message);
            });
            this.loading = this.loadingCtrl.create();
            this.loading.present();
          }
        }
      ]
    });
    alert.present();
  }

  //Message de controle pour confirmation de la supression de compte
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Supprimer votre compte',
      message: 'La suppression de votre compte  a une incidence sur toutes les données associées à ce compte. Êtes-vous sûr de vouloir supprimer définitivement votre compte ? ',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Oui',
          handler: () => {
            this.Delteuser()
          }
        }
      ]
    });
    alert.present();
  }

  //message de confirmation
  showMessage(message: string) {
    this.loading.dismiss().then(() => {
      let alert = this.alertCtrl.create({
        message: message,
        buttons: [
          {
            text: "Ok",
            role: 'cancel'
          }
        ]
      });
      alert.present();
      console.log(message);
    });
  }


  //Navigation vers la page des Annonces de l'utilisateur
  annonces() {
    this.navCtrl.push(MesAnnonces)
  }


  //Navigation vers la page des Favoris de l'utilisateur

  MesFavoris() {
    this.navCtrl.push(MesFavorisPage)
  }

  //Activation du mode  suivie de position
  start_stop() {
    this.check ? this.LocationTracker.startTracking() : this.LocationTracker.stopTracking();
  }

  changer() {
    this.check ? this.check = false : this.check = true
    this.start_stop();
  }
}
