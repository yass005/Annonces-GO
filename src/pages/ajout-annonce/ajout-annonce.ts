import { CategoriesComponent } from './../../components/categories/categories';
import { CategorieProvider } from './../../providers/categorie/categorie';
import { Component } from '@angular/core';
import {ActionSheetController, IonicPage,  NavController,  NavParams,  ToastController} from 'ionic-angular';
import { AnnonceProvider } from '../../providers/annonce/annonce';
import { Annonce } from '../../model/annonce';
import { categorie } from '../../model/categorie';
import { categories } from '../../model/cats';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';


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
  private todo : FormGroup;
   public ann : Annonce=null;
   public guestPicture: string = null;
   Cats: categorie[]
  constructor(public navCtrl: NavController, public navParams: NavParams,public  annonceProvider : AnnonceProvider,
  private formBuilder: FormBuilder, private toastCtrl: ToastController, private camera: Camera,public actionSheetCtrl: ActionSheetController,
) {

     this.todo = this.formBuilder.group({
      title: ['',  Validators.compose([Validators.minLength(5), Validators.required])],
      categorie: ['', Validators.required],
      description: ['', Validators.compose([Validators.minLength(20), Validators.required])],
    });

    this.Cats=categories;
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
  categorie: { nom: this.todo.value.categorie, icon : "test"},
  imageURL:this.guestPicture,
  location  : {lat:0, lng:0}
}

console.log( this.ann);
this.annonceProvider.Ajouter_annonce(this.ann);

console.log(this.annonceProvider.List_des_annonces());
 this.presentToast();

  }


presentToast() {
  let toast = this.toastCtrl.create({
    message: 'Annonces was added successfully',
    duration: 3000,
    position: 'top'
  });

  toast.onDidDismiss(() => {
    this.todo.reset();
  });

  toast.present();
}

  callMyAction() {


    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
           this.camera.PictureSourceType.PHOTOLIBRARY;
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.camera.PictureSourceType.CAMERA;
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present()


const options: CameraOptions = {
     quality : 95,
    destinationType : this.camera.DestinationType.DATA_URL,
    allowEdit : true,
    encodingType: this.camera.EncodingType.PNG,
    targetWidth: 500,
    targetHeight: 500,
    saveToPhotoAlbum: true
}

this.camera.getPicture(options).then(imageData => {
    this.guestPicture = imageData;
    console.log(this.guestPicture);
  }, error => {
    console.log("ERROR -> " + JSON.stringify(error));
  });
}


}
