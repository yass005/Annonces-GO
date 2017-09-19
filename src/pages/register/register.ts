/*--------------------------- Page d'enregistrement d'un nouveau compte  ------------------------*/
/*	  dans cette page j'ai injecter  le service de l'authetification  pour                       */
/*	 enregistrer un nouveau compte  avec controle et validation des données                      */
/*------------------------------------------------------------------------------------           */
import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  Loading,
  LoadingController,
  AlertController
} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';

/**
 * Generated class for the RegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  //Variables pour le formulaire d'inscription
  public signupForm: FormGroup;
  public loading: Loading;
  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public authProvider: AuthProvider) {
    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      Confirmpassword: ['', Validators.compose([
        Validators.required,
        this.isEqualPassword.bind(this)
      ])],
    });

  }

/* Contrôle des données saisi dans le formulaire et envois d'une requête de création
 d'un nouveau utilisateur */

  signupUser(): void {
    if (!this.signupForm.valid) {
      console.log(this.signupForm.value);
    } else {
      this.authProvider.signupUser(this.signupForm.value.email,
        this.signupForm.value.password).then(() => {
          this.loading.dismiss().then(() => {
          });
        }, (error) => {
          this.loading.dismiss().then(() => {
            var errorMessage: string = error.message;
            let alert = this.alertCtrl.create({
              message: errorMessage,
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


  //controle de la a confirmation du mot de passe
  isEqualPassword(control: FormControl): { [s: string]: boolean } {
    if (!this.signupForm) {
      return { passwordsNotMatch: true };

    }
    if (control.value !== this.signupForm.controls['password'].value) {
      return { passwordsNotMatch: true };
    }
  }
}


