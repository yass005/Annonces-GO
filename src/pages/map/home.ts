import { Annonce } from './../../model/annonce';
import { Component } from '@angular/core';
import { NavController, Platform, ModalController } from 'ionic-angular'
// Native components
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, GoogleMapsAnimation, MarkerOptions, Marker } from '@ionic-native/google-maps';
import { treeMap, TreeMappingMock } from '../../model/tri.mapping';
import { CategorieProvider } from '../../providers/categorie/categorie';
import { Observable } from 'rxjs/Rx';
import { FirebaseListObservable } from 'angularfire2/database';
import { AnnoncePage } from '../annonce/annonce';
import { Subscription } from 'rxjs/Subscription';
// Mocks


const MARKER_SIZE = 30;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  Annonce:  Annonce[] = [];
    sub : Subscription
  constructor(public navCtrl: NavController, private geoLocation: Geolocation ,private modalCtrl: ModalController,
    private categorieProvider : CategorieProvider,
    private googleMaps: GoogleMaps, public platform: Platform) {
      this.sub=this.categorieProvider.findAllAnnonces().map(Annonces=> { return Annonces.filter(Annonce => {
       return !!Annonce.location
     })

 }).subscribe(Annonces => {
   this.Annonce=Annonces
   console.log(this.Annonce);
 })

    // Data
  //  this.list = TreeMappingMock;
   // console.log(this.list.length);
  //  console.log(this.list);

  }
  ngOnDestroy() {
    this.sub.unsubscribe();
      }
ngAfterViewInit() {

    this.loadMap();
}
loadMap() {
 // make sure to create following structure in your view.html file
 // and add a height (for example 100%) to it, else the map won't be visible
 // <ion-content>
 //  <div #map id="map" style="height:100%;"></div>
 // </ion-content>

 // create a new map by passing HTMLElement
 let element: HTMLElement = document.getElementById('map');

 let map: GoogleMap = this.googleMaps.create(element);

   this.geoLocation.getCurrentPosition().then((resp) => {

      let userPosition: LatLng = new LatLng(resp.coords.latitude, resp.coords.longitude);

      let position: CameraPosition = {

        target: userPosition,
        zoom: 14,
        tilt: 0
      };

      map.moveCamera(position).then(()=>{
        let item={imageURL:"assets/Img/placeholder.png",titre:"Ma Position",location:{lat: userPosition.lat ,lng:userPosition.lng}}
        this.addMarkerOnMap(item , map)
      })
    }).catch((error) => {
      console.log('Error getting location', error);
    });

 // create ne
 // listen to MAP_READY event
 // You must wait for this event to fire before adding something to the map or modifying it in anyway

 map.one(GoogleMapsEvent.MAP_READY).then(
   () => {
     console.log('Map is ready!');

this.Annonce.forEach(item=>{
  this.addMarkerOnMap(item , map);

  })
     }
     )

     // Now you can add elements to the map like the marker
 }

  private addMarkerOnMap(item: any, map: GoogleMap) {
    // create LatLng object
    let markerPosition: LatLng = new LatLng(item.location.lat,item.location.lng);

    let markerIcon = {
		 'url': item.imageURL,
		 'size': {
			 width: Math.round(MARKER_SIZE),
			 height: Math.round(MARKER_SIZE)
		 }
	 }

   let markerOptions: MarkerOptions = {
			position: markerPosition,
      title: item.titre,
			animation: GoogleMapsAnimation.BOUNCE,
			icon: markerIcon
		};


    map.addMarker(markerOptions)
		.then((marker: Marker) => {
      marker.showInfoWindow()
   //   marker.addEventListener('click').subscribe(() => { this.onOpenMap(item.$key); });
    })

  }

}
