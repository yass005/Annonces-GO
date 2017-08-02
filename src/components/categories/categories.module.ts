import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoriesComponent } from './categories';

@NgModule({
  declarations: [
    CategoriesComponent,
  ],
  imports: [
    IonicPageModule.forChild(CategoriesComponent),
  ],
  exports: [
    CategoriesComponent
  ]
})
export class CategoriesComponentModule {}
