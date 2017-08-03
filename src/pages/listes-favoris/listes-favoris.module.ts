import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListesFavorisPage } from './listes-favoris';

@NgModule({
  declarations: [
    ListesFavorisPage,
  ],
  imports: [
    IonicPageModule.forChild(ListesFavorisPage),
  ],
  exports: [
    ListesFavorisPage
  ]
})
export class ListesFavorisPageModule {}
