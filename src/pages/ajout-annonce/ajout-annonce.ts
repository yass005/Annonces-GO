import { CategoriesComponent } from './../../components/categories/categories';
import { CategorieProvider } from './../../providers/categorie/categorie';
import { Component } from '@angular/core';
import {AlertController, ActionSheetController,  IonicPage,   NavController,   NavParams,   ToastController} from 'ionic-angular';
import { AnnonceProvider } from '../../providers/annonce/annonce';
import { Annonce } from '../../model/annonce';
import { categorie } from '../../model/categorie';
import { categories } from '../../model/cats';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { FirebaseListObservable } from 'angularfire2/database';


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
  public todo : FormGroup;
   public ann : Annonce=null;
   public guestPicture: string = null;
   Cats: FirebaseListObservable<categorie[]>;
  constructor(public navCtrl: NavController, public navParams: NavParams,public  annonceProvider : AnnonceProvider,
  private formBuilder: FormBuilder, private toastCtrl: ToastController,
  private alertCtrl: AlertController,
   private camera: Camera,public actionSheetCtrl: ActionSheetController,public categorieProvider : CategorieProvider
) {

     this.todo = this.formBuilder.group({
      title: ['',  Validators.compose([Validators.minLength(10), Validators.required])],
      categorie: ['', Validators.required],
      description: ['', Validators.compose([Validators.minLength(20), Validators.required])],

    });

    this.Cats=categorieProvider.items$;
   // console.log(categorieProvider.items$);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AjoutAnnoncePage');
  }


logForm(){
    console.log(this.todo.value)
    this.ann={
  titre : this.todo.value.title,
  description : this.todo.value.description,
  categorie:  this.todo.value.categorie,
  imageURL:this.guestPicture,
  location  : {lat:0, lng:0}
}

console.log( this.ann);
this.annonceProvider.Ajouter_annonce(this.ann)

console.log(this.annonceProvider.List_des_annonces());
 this.presentToast('Annonces was added successfully');

  }


presentToast(message : string) {
  let toast1 = this.toastCtrl.create({
    message: message,
    duration: 3000,
    position: 'top'
  });

  toast1.onDidDismiss(() => {
    this.todo.reset();
  });

  toast1.present();
}


  takePicture(SourceType){
  this.camera.getPicture({
    quality : 50,
    destinationType : this.camera.DestinationType.DATA_URL,
    sourceType : SourceType,
    allowEdit : true,
    encodingType: this.camera.EncodingType.PNG,
    targetWidth: 500,
    targetHeight: 500,
    saveToPhotoAlbum: true
  }).then(imageData => {
    this.guestPicture = imageData;
  }, error => {
     this.presentAlert(error);
  //  console.log("ERROR -> " + JSON.stringify(error));
  });
}

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  presentAlert(message : string) {
    let alert = this.alertCtrl.create({
      title: 'Camera',
      subTitle: message,
      buttons: ['ok']
    });
    alert.present();
  }

}
