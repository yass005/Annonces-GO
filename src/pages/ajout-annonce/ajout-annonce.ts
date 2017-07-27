import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController  } from 'ionic-angular';
import { AnnonceProvider } from '../../providers/annonce/annonce';
import { Annonce } from '../../model/annonce';
import { categorie } from '../../model/categorie';
import { categories } from '../../model/cats';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
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
   ann : Annonce
   Cats: categorie[]
  constructor(public navCtrl: NavController, public navParams: NavParams,public  annonceProvider : AnnonceProvider,
  private formBuilder: FormBuilder, private toastCtrl: ToastController) {

     this.todo = this.formBuilder.group({
      title: ['',  Validators.compose([Validators.minLength(20), Validators.required])],
      categorie: ['', Validators.required],
      description: ['', Validators.compose([Validators.minLength(50), Validators.required])],
    });

    this.Cats=categories;
    this.ann= null;
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
  imageURL: 'http://placehold.it/100x60?text=F3',
 // location  : {lat:0, lng:0}
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
  //  this.todo.reset();
  });

  toast.present();
}

}
