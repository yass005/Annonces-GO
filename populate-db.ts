// script simple déveloper pour la liste des catégorie car le besoin la avant la page d'administrations
import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import {database, initializeApp} from "firebase";
import {firebaseConfig} from "./src/environments/firebase.config";
import {dbData} from "./db-data";


console.log("ajoute de la liste des catégorie");



initializeApp(firebaseConfig);

const categoriesRef = database().ref('categories');

dbData.categories.forEach( categorie => {

  console.log('adding course', categorie.nom);

   categoriesRef.push({nom: categorie.nom, icon:categorie.icon})

});




