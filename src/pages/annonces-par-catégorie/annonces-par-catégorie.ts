import { Geolocation } from '@ionic-native/geolocation';
import { Component } from '@angular/core';
import { ModalController, ViewController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { Annonce } from '../../model/annonce';
import { FirebaseListObservable } from 'angularfire2/database';
import { CategorieProvider } from '../../providers/categorie/categorie';
import { AnnoncePage } from '../annonce/annonce';
import { Loc } from '../../model/location';
import { Subscription } from 'rxjs/Subscription';
import { ProfileProvider } from '../../providers/profile/profile';

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

  AnnoncesParCategorie: Observable<any[]>;
  userPosition: Loc
  annoncesDistance:  any[] = [];
  sub : Subscription
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private geoLocation: Geolocation,
    private categorieProvider: CategorieProvider,
    private profileProvider: ProfileProvider,
    private modalCtrl: ModalController) {

    this.AnnoncesParCategorie = this.categorieProvider.GetAnnoncesParCatégoriePage(this.navParams.get('CategorieId')).distinctUntilChanged();
    console.log(this.AnnoncesParCategorie);
    this.geoLocation.getCurrentPosition().then((resp) => {

      this.userPosition = { lat: resp.coords.latitude, lng: resp.coords.longitude };
      return this.userPosition;
    }).then(res => {

      if (this.profileProvider.currentUser)
        {
      this.sub=this.AnnoncesParCategorie.map(Annonces => {
        return Annonces.filter(Annonce => {
          return !!Annonce.location
        }).map(Annonce => {
          return { id: Annonce.$key,  distance: this.getDistanceBetweenPoints(res, Annonce.location.Lat, Annonce.location.Long, 'km') }
        })
      }).subscribe(val=>{
        this.annoncesDistance=val;
        console.log(  this.annoncesDistance);
      })
    }else {
      this.sub.unsubscribe()
    }
    })
      .catch((error) => {
        console.log('Error getting location', error);
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnnoncesParCatégoriePage');
  }
  ionViewDidLeave(){
    this.sub.unsubscribe()

      }

  onOpenMap(key: string) {
    const modal = this.modalCtrl.create(AnnoncePage,
      { Id: key, Position: this.userPosition });

    modal.present();

  }
  getDistanceFromMe(key: string){
    return this.annoncesDistance.filter(Annonce=>{
       return Annonce.id===key
     }).map(Annonce=>{
       return Number(Annonce.distance).toFixed(2)

     })
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
