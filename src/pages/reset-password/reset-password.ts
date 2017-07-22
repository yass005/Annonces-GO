import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  AlertController,
  LoadingController
} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';


@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {
  public resetPasswordForm: FormGroup;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
    formBuilder: FormBuilder, public authProvider: AuthProvider,
    public loadingCtrl: LoadingController) {
    this.resetPasswordForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required,
      EmailValidator.isValid])],
    });
  }

  resetPassword(): void {
    if (!this.resetPasswordForm.valid) {
      console.log(this.resetPasswordForm.value);
    } else {
      const loading = this.loadingCtrl.create();
      this.authProvider.resetPassword(this.resetPasswordForm.value.email)
        .then(() => {
          loading.dismiss().then(() => {
            const alert = this.alertCtrl.create({
              title: 'lien de réinitialisation envoyé',
              subTitle: `Un lien pour réinitialiser votre mot de passe a été envoyé par e-mail à ${this.resetPasswordForm.value.email}`,
              buttons: [
                {
                  text: 'OK',
                  handler: data => {
                    this.navCtrl.pop();
                  }
                }
              ]
            });
            alert.present();
          });
        }, error => {
          loading.dismiss().then(() => {
            const alert = this.alertCtrl.create({
              title: error.name,
              subTitle: `Aucun compte ne correspond à ${this.resetPasswordForm.value.email} Peut-être avez-vous utilisé une adresse e-mail différente/incorrecte lors de votre inscription`,
              buttons: [
                {
                  text: 'OK',
                  handler: data => {
                    console.log("There was an error");
                  }
                }
              ]
            });
            alert.present();
          });
        });
      loading.present();
    }
  }
}
