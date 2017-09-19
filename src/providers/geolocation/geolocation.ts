/*---------------------------Service pour Les Geolocation---------------------*/
/* Service GeolocationProvider qui gère les foncion de geoLocation           */
/*ce service permet de récupérer la position de l'utilisateur  Le géocodage  */
/* calcule de la distance entre 2 points Gps                                 */
/*------------------------------------------------------------------------- */

import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder,  NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { Loc } from '../../model/location';
import { IGeolocation } from '../../model/IGeolocation';
import { Observable } from 'rxjs/Observable';
/*
  Generated class for the GeolocationProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GeolocationProvider implements IGeolocation {
  UserPosition: Loc
  constructor(
    private platform: Platform,
    private geoLocation: Geolocation,
    public nativeGeocoder: NativeGeocoder,

  ) {
    platform.ready().then(() => {

      // get current position
      this.geoLocation.getCurrentPosition().then(pos => {

        this.UserPosition = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        console.log(this.UserPosition);
      })
    }).catch(err => {
      console.log(err);
    })

  }

  //recuperatin de la position gps de l'utilisateur
  Position(): Promise<any> {

    return this.geoLocation.getCurrentPosition()
  }

  //permet de garder un  Observable sur la position du périphérique de l'utilisateur
  WatchPosition(): Observable<any> {
    return this.geoLocation.watchPosition();
  }


  //Cette fonction permet le  géocodage pour convertir des adresses en en coordonnées géographiques
  AdressTolatitudelongitude(adress: string): Promise<any> {

    return this.nativeGeocoder.forwardGeocode(adress)

  }

  //Claculte de la distance entre 2 point gps et retourne la valeur par rapport
  //a unité donné en paramétre KM ou mile fonction bvasé sur la formule de haversine
  // important cette formuale calcule la distance mais pas le chemin
  getDistanceBetweenPoints(Destination: Loc, units) {
    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };

    let R = earthRadius[units || 'km'];
    let lat1 = this.UserPosition.lat;
    let lon1 = this.UserPosition.lng;
    let lat2 = Destination.lat;
    let lon2 = Destination.lng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d


  }


  //  convert degrees to radians
  toRad(x) {
    return x * Math.PI / 180;
  }
}
