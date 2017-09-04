import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase'
import { ProfileProvider } from '../../providers/profile/profile';
import { GeolocationProvider } from '../../providers/geolocation/geolocation';
/**
 * Generated class for the TestPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage {
Userposition: any
  constructor(public profile: ProfileProvider, public navParams: NavParams  , geolocationProvider : GeolocationProvider) {


  }
  ionViewDidLoad(){
    this.profile.userProfile.child('position').once('value', Snapshot => {
      this.Userposition=Snapshot.val()
      console.log(Snapshot.val());

    })
    const UserFavoris = this.profile.userProfile.child('Favoris');
    UserFavoris.once("value").then((snapshot) => {
      if (snapshot.exists()) {
        let favorisIDs =  Object.keys(snapshot.val())
        console.log(favorisIDs);
        firebase.database().ref('/Annonces').once("value").then( Annonces => {

          Annonces.forEach(childSnapshot=> {
          if (  favorisIDs.includes(childSnapshot.val().categorie) && (this.getDistanceBetweenPoints(this.Userposition, childSnapshot.val().location, 'km' ))<=0.5) {
            console.log(childSnapshot.val())
          }
          })

       /*   let Annonce=Annonces.val()
           console.log(Annonce.val)*/
        })
      }
      else {
        console.log('the user dont have a favoris exit code 1')
      }
    })
  }


  getDistanceBetweenPoints( UserPosition, Destination, units)

  {


    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };

        let R = earthRadius[units || 'km'];
        let lat1 = UserPosition.Lat;
        let lon1 = UserPosition.Long;
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

         return  d


    }



    toRad(x)
    {
      return x * Math.PI / 180;
    }
}
