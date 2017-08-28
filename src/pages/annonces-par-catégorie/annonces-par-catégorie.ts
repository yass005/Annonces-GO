import { Geolocation } from '@ionic-native/geolocation';
import { Component } from '@angular/core';
import { ModalController, ViewController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { Annonce } from '../../model/annonce';
import { FirebaseListObservable } from 'angularfire2/database';
import { CategorieProvider } from '../../providers/categorie/categorie';
import { AnnoncePage } from '../annonce/annonce';
import { Loc } from '../../model/location';

/**
 * Generated class for the AnnoncesParCatégoriePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-annonces-par-catégorie',
  templateUrl: 'annonces-par-catégorie.html',
})
export class AnnoncesParCatégoriePage {

  items: Observable<any[]>;
  userPosition: Loc
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private geoLocation: Geolocation,
    private categorieProvider: CategorieProvider, private modalCtrl: ModalController) {

    this.items = this.categorieProvider.GetAnnoncesParCatégoriePage(this.navParams.get('CategorieId'));
    console.log(this.items);
    this.geoLocation.getCurrentPosition().then((resp) => {

      this.userPosition = { lat: resp.coords.latitude, lng: resp.coords.longitude };
      return this.userPosition;
    }).then(res => {

      this.items = this.categorieProvider.GetAnnoncesParCatégoriePage(this.navParams.get('CategorieId')).map(Annonces => {
        return Annonces.filter(Annonce => {
          return !!Annonce.location
        }).map(Annonce => {
          return { id: Annonce.$key, titre: Annonce.titre, image: Annonce.imageURL, distance: this.getDistanceBetweenPoints(res, Annonce.location.Lat, Annonce.location.Long, 'km') }
        })
      })
    })
      .catch((error) => {
        console.log('Error getting location', error);
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnnoncesParCatégoriePage');
  }


  onOpenMap(key: string) {
    const modal = this.modalCtrl.create(AnnoncePage,
      { Id: key, Position : this.userPosition  });

    modal.present();

  }

  getDistanceBetweenPoints(start, endlat, endlng, units) {

    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };

    let R = earthRadius[units || 'km'];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = endlat;
    let lon2 = endlng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d;

  }

  toRad(x) {
    return x * Math.PI / 180;
  }

}
