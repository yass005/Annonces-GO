import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  Loading,
  LoadingController,
  AlertController
} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { RegisterPage } from '../register/register';
import { ResetPasswordPage } from '../reset-password/reset-password';
import { EmailValidator } from '../../validators/email';
import { ProfilePage } from '../profile/profile';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginForm: FormGroup;
  public loading: Loading;

  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController, public authProvider: AuthProvider,
    public formBuilder: FormBuilder, public alertCtrl: AlertController) {

      // initiation du formulaire de'nvoie du login mot de passe avec controle de validité de email et mot longeur
      //du mot de passe
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6),
      Validators.required])]
    });

  }
  //// appel de ma méthode de connexion login email/mot de passe depuis le service de authetification
  loginUser(): void {
    if (!this.loginForm.valid) {
      console.log(this.loginForm.value);
    } else {
      this.authProvider.loginUser(this.loginForm.value.email,
        this.loginForm.value.password).then(() => {
          this.loading.dismiss().then(() => {
          });
        }, error => {
          this.loading.dismiss().then(() => {
            let alert = this.alertCtrl.create({

              message: " login ou mot de passe incorrecte !",
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

  goToResetPassword(): void { this.navCtrl.push(ResetPasswordPage); }

  goToSignup(): void { this.navCtrl.push(RegisterPage); }

// appel de ma méthode de connexion facebook depuis le service de authetification
  facebookLogin(): void {

    this.authProvider.facebookLogin().then(() => {
      console.log("ok")
    }, error => {
      this.showMessage(error.message);
    });
    this.loading = this.loadingCtrl.create();
    this.loading.present();
  }
  // appel de ma méthode de connexion google depuis le service de authetification
  googlelogin(): void {
    this.authProvider.googleLogin().then(() => {
      console.log("ok")
    }, error => {
      this.showMessage(error.message);
    });
    this.loading = this.loadingCtrl.create();
    this.loading.present();
  }

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
}
