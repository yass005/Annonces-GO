import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AjoutAnnoncePage } from './ajout-annonce';

@NgModule({
  declarations: [
    AjoutAnnoncePage,
  ],
  imports: [
    IonicPageModule.forChild(AjoutAnnoncePage),
  ],
  exports: [
    AjoutAnnoncePage
  ]
})
export class AjoutAnnoncePageModule {}
