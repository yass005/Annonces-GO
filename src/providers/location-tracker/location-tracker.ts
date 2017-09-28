/*---------------------------Service pour Le tracking de la  Geolocation--------  */
/* Service LocationTrackerProvider qui gère les foncion de tracking de position  */
/*ce service permet de récupérer la position de l'utilisateur  et de la mettre  */
/* a jour en temps réel dans firebase                                          */
/*-------------------------------------------------------------------------   */
import { ModalController, ViewController, IonicPage, NavController, LoadingController, Loading } from 'ionic-angular';
import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/filter';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { Loc } from '../../model/location';
import { ProfileProvider } from '../profile/profile';

/*
  Generated class for the LocationTrackerProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class LocationTrackerProvider {
  public watch: any;
  public loading: Loading;
  locat: Loc = { lat: 0, lng: 0 }
  adress: string = "";
  constructor(public zone: NgZone, public backgroundGeolocation: BackgroundGeolocation,
    public loadingCtrl: LoadingController,
    public geolocation: Geolocation,
    public nativeGeocoder: NativeGeocoder, public profileProvider: ProfileProvider) {
    console.log('Hello LocationTrackerProvider Provider');
  }
  // Background Tracking
  startTracking() {

    // Background Tracking option

    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 100,
      debug: true,
      interval: 5000,
    };

    this.backgroundGeolocation.configure(config).subscribe((location) => {

      console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
      this.profileProvider.updatePosition(location.latitude, location.longitude);
      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.locat.lat = location.latitude;
        this.locat.lng = location.longitude;
      });

    }, (err) => {

      console.log(err);

    });

    // Turn ON the background-geolocation system.
    this.geolocation.getCurrentPosition().then(pos => {
      return pos
    }).then((pos) => {
      console.log(pos)
      this.loading.dismiss();
      return this.backgroundGeolocation.start();

    }).catch(err => {
      console.log(err)
    })

    this.loading = this.loadingCtrl.create({
      content: 'chargement en cours...',
      duration: 5000
    });
    this.loading.present();

    // Foreground Tracking

    /*let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

      console.log(position);
      this.profileProvider.updatePosition(position.coords.latitude, position.coords.longitude );
      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.locat.lat = position.coords.latitude;
        this.locat.lng = position.coords.longitude;
      });

    });*/

  }


  stopTracking() {
    if (!this.startTracking) { return; }

    this.backgroundGeolocation.stop();
    //this.watch.unsubscribe();
    console.log('stopTracking');
  }

  getAdress(lat, lng) {
    this.nativeGeocoder.reverseGeocode(lat, lng)
      .then((result: NativeGeocoderReverseResult) => {
        this.adress = "The address is " + result.street + " " + result.houseNumber + " in " + result.city + ", " + result.countryCode;
        console.log("The address is " + result.street + " " + result.houseNumber + " in " + result.city + ", " + result.countryCode);
      }
      )
  }
}
