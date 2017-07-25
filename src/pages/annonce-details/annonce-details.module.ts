import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnnonceDetailsPage } from './annonce-details';

@NgModule({
  declarations: [
    AnnonceDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(AnnonceDetailsPage),
  ],
  exports: [
    AnnonceDetailsPage
  ]
})
export class AnnonceDetailsPageModule {}
