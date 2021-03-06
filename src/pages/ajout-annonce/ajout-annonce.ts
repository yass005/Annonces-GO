import { Adress } from './../../model/adress';
/*--------------------------- Page d'ajoutd'une  annonce   --------------------------------    */
/*	dans cette page j'ai injecté  le service de AnnonceProvider  pour l'ajout d'une annonce   */
/*	le     service  CategorieProvider pour avoir la lste des   categories                    */
/*------------------------------------------------------------------------------------      */
import { CategorieProvider } from './../../providers/categorie/categorie';
import { Component } from '@angular/core';
import { AlertController, ActionSheetController, IonicPage, NavController, NavParams, ToastController, LoadingController, Loading } from 'ionic-angular';
import { AnnonceProvider } from '../../providers/annonce/annonce';
import { Annonce } from '../../model/annonce';
import { categorie } from '../../model/categorie';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { FirebaseListObservable } from 'angularfire2/database';
import { GeolocationProvider } from '../../providers/geolocation/geolocation';


/**
 * Generated class for the AjoutAnnoncePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-ajout-annonce',
  templateUrl: 'ajout-annonce.html',
})
export class AjoutAnnoncePage {
  public annonceForm: FormGroup;
  public annonce = <Annonce>{};
  public loading: Loading;
public adress=<Adress>{}
public AnnonceAModifier : Annonce=null;
  public Photo: string = null;
  Categories: FirebaseListObservable<categorie[]>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public annonceProvider: AnnonceProvider,
    private formBuilder: FormBuilder, private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private camera: Camera, public actionSheetCtrl: ActionSheetController,
   private  geolocationProvider : GeolocationProvider,
   public loadingCtrl: LoadingController,
     public categorieProvider: CategorieProvider
  ) {
if(this.navParams.get('Annonce')!=null){
  this.AnnonceAModifier = this.navParams.get('Annonce');
  console.log(this.navParams.get('Annonce'));
}

    this.annonceForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.minLength(11), Validators.required])],
      categorie: ['', Validators.required],
      description: ['', Validators.compose([Validators.minLength(21), Validators.required])],

    });

    this.Categories = categorieProvider.items$;
    // console.log(categorieProvider.items$);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AjoutAnnoncePage');
  }



  logForm() {
    console.log(this.annonceForm.value)
    this.annonce = {
      titre: this.annonceForm.value.title,
      description: this.annonceForm.value.description,
      categorie: this.annonceForm.value.categorie,
      imageURL: this.Photo,
      location: { lat: 0, lng: 0 }
    }

    console.log(this.annonce);
    this.annonceProvider.AjouterAnnonce(this.annonce).then(resole => {
      return resole
    }).then(resole => {
      this.presentToast('Votre annonce a été ajouté');
    }).catch(err => {
      this.presentToast(err.message);
    })

    console.log(this.annonceProvider.getList_des_annonce());


  }



  //Controle Toast pour l'affichage d'un message aprés la confirmation de l'ajout d'une Annonce

  presentToast(message: string) {
    let toast1 = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });

    toast1.onDidDismiss(() => {
      this.annonceForm.reset();
    });

    toast1.present();
  }

  //Fonction qui utilise le plugion cordova photo pour prendre une photo sois depuis la galerie
  // sois depuis l'appareil photo
  takePicture(SourceType) {
    this.camera.getPicture({
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: SourceType,
      allowEdit: true,
      encodingType: this.camera.EncodingType.PNG,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: true
    }).then(imageData => {
      this.Photo = imageData;
    }, error => {
      this.presentAlert(error);
      //  console.log("ERROR -> " + JSON.stringify(error));
    });
  }
  //Controle de type ActionSheet qui permet a l'utilisateur de choisir etre la Galerie et l'appareil photo
  public SelectPosition() {
    let actionSheet = this.actionSheetCtrl.create({
      title: " emplacement de l'annonce ",
      buttons: [
        {
          text: 'Maposition',
          handler: () => {
            this.GetPosition();
          }
        },
        {
          text: 'MonAdress',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'SaisieAdress',
          handler: () => {
            this.AdressTolanlng();
          }
        },
        {
          text: 'Annuler',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  //Controle de type ActionSheet qui permet a l'utilisateur de choisir etre la Galerie et l'appareil photo
  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Sélectionner une image',
      buttons: [
        {
          text: 'Galerie',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Appareil photo',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Annuler',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  //Message d'erreur
  presentAlert(message: string) {
    let alert = this.alertCtrl.create({
      title: 'Camera',
      subTitle: message,
      buttons: ['ok']
    });
    alert.present();
  }

  GetPosition(){

  this.geolocationProvider.Position().then(pos => {
this.annonce.location={ lat: pos.coords.latitude, lng: pos.coords.longitude };

console.log(this.annonce);
    }).catch(err => {
      console.log(err);
    })
  }

  AdressTolanlng() {
    const alert = this.alertCtrl.create({
      message: "Votre adress",
      inputs: [
        {
          name: 'rue',
          placeholder: 'rue',

        },
        {
          name: 'numéro',
          placeholder: 'numéro',

        },
        {
          name: 'ville',
          placeholder: 'ville',

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
            this.geolocationProvider.AdressTolatitudelongitude(`${data.rue} ${data.numéro} ${data.ville}`)
              .then(() => {
             //   this.showMessage("Votre adresse a été modifié");

              }).catch(error => {
             //   this.showMessage(error.message);
              })
            this.loading = this.loadingCtrl.create();
            this.loading.present();
          }
        }
      ]
    });
    alert.present();
  }

}
