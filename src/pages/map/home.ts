import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular'
// Native components
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, GoogleMapsAnimation, MarkerOptions, Marker } from '@ionic-native/google-maps';
import { treeMap, TreeMappingMock } from '../../model/tri.mapping';

// Mocks


const MARKER_SIZE = 30;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private list : treeMap[]


  constructor(public navCtrl: NavController, private geoLocation: Geolocation ,private googleMaps: GoogleMaps, public platform: Platform) {

    // Data
    this.list = TreeMappingMock;
    console.log(this.list.length);
    console.log(this.list);

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

      map.moveCamera(position);

    }).catch((error) => {
      console.log('Error getting location', error);
    });
 // create ne
 // listen to MAP_READY event
 // You must wait for this event to fire before adding something to the map or modifying it in anyway
 map.one(GoogleMapsEvent.MAP_READY).then(
   () => {
     console.log('Map is ready!');
       for(var tree of this.list) {
          this.addMarkerOnMap(tree, map);
        }
     // Now you can add elements to the map like the marker
   }
 );

 }

  private addMarkerOnMap(tree: treeMap, map: GoogleMap) {
    // create LatLng object
    let markerPosition: LatLng = new LatLng(tree.lat,tree.lng);

    let markerIcon = {
		 'url': tree.globalImage,
		 'size': {
			 width: Math.round(MARKER_SIZE),
			 height: Math.round(MARKER_SIZE)
		 }
	 }

   let markerOptions: MarkerOptions = {
			position: markerPosition,
			title: tree.name,
			snippet: 'Touch for more infos',
			animation: GoogleMapsAnimation.DROP,
			icon: markerIcon
		};

    map.addMarker(markerOptions)
		.then((marker: Marker) => {
			marker.showInfoWindow();
		});

  }
}
