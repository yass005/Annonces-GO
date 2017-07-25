// tslint:disable-next-line:no-unused-variable

import { Annonce } from '../../model/annonce';
import { annonces } from '../../model/Annonces';
import { AnnonceProvider } from './annonce';


let annonce = null;
let an: Annonce= {

  titre : 'telephone iphone',
  description : 'telephone iphone trés bonne état',
  categorie: {nom:'téléphonie'},
  imageURL: '"http://placehold.it/100x60?text=F3"'

}

let an1: Annonce= {

  titre : '',
  description : '',
  categorie: {nom:''},
  imageURL: ''
}
describe('annonces Service', () => {

  beforeEach(() => {
      annonce = new AnnonceProvider();
    });

     it('should return a non empty array', () => {

            let result = annonce.List_des_annonces();

            expect(Array.isArray(result)).toBeTruthy;
            expect(result.length).toBeGreaterThan(0);
        }
    );

    it('should do nothing', () => {

        expect(true).toBeTruthy();

    });

 it('should add an annonce to the list  nothing', () => {
 let result = annonce.Ajouter_annonce(an);
        expect(result).toBeTruthy();

    });

     it('should remove an annonce from  the list', () => {
    let result = annonce.removeAnnonce(an1);
        expect(result).toBeFalsy();

    });


});
