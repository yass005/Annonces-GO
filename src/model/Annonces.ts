
// fichier de mocks utilisé pour realisé des test unitaire
import { Annonce } from './annonce';


const Annonces : Annonce[] = [{

  titre : 'telephone android',
  description : 'telephone android trés bonne état',
  categorie: {nom:'téléphonie'},
  imageURL: 'http://placehold.it/100x60?text=F3'

},
{

  titre : 'telephone iphone',
  description : 'telephone iphone trés bonne état',
  categorie: {nom:'téléphonie'},
  imageURL: 'http://placehold.it/100x60?text=F3'

},
{

  titre : 'telephone nokia',
  description : 'telephone nokia trés bonne état',
  categorie: {nom:'téléphonie'},
  imageURL: 'http://placehold.it/100x60?text=F3'

},

]


export const annonces=Annonces;
