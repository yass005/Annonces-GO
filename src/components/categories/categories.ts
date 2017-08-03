import { FirebaseListObservable } from 'angularfire2/database';
import { Component, Output } from '@angular/core';
import { CategorieProvider } from './../../providers/categorie/categorie';
import { categorie } from '../../model/categorie';

/**
 * Generated class for the CategoriesComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'categories',
  templateUrl: 'categories.html'
})
export class CategoriesComponent {

  items: FirebaseListObservable<categorie[]>;

  constructor(private categorieProvider : CategorieProvider) {
    console.log('Hello CategoriesComponent Component');
    this.items = categorieProvider.items$;

  }

}
