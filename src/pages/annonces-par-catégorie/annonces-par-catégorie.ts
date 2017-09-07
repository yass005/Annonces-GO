import { Component } from '@angular/core';
import { ModalController, ViewController, IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { Annonce } from '../../model/annonce';
import { FirebaseListObservable } from 'angularfire2/database';
import { CategorieProvider } from '../../providers/categorie/categorie';
import { AnnoncePage } from '../annonce/annonce';
import { Loc } from '../../model/location';
import { Subscription } from 'rxjs/Subscription';
import { ProfileProvider } from '../../providers/profile/profile';
import { GeolocationProvider } from '../../providers/geolocation/geolocation';


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
  public loading: Loading;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private categorieProvider: CategorieProvider,
    private GeolocationService : GeolocationProvider,
    private profileProvider: ProfileProvider,
    public loadingCtrl: LoadingController,
    private modalCtrl: ModalController) {

     this.AnnoncesParCategorie = this.categorieProvider.GetAnnoncesParCatégoriePage(this.navParams.get('CategorieId'));
      this.GeolocationService.Position().then(res=> {
        console.log(res);
        return res
      }).then(()=> {
        this.sub=this.AnnoncesParCategorie.map(Annonces => {
                return Annonces.filter(Annonce => {
                  return !!Annonce.location
                }).map(Annonce => {
                  return { id: Annonce.$key,  distance: this.GeolocationService.getDistanceBetweenPoints(Annonce.location, 'km') }
                })
              }).subscribe(val=>{
                this.annoncesDistance=val;
                console.log(  this.annoncesDistance);
              }, err => {
                console.log(err.message)
              }
            )

      }).then(()=>{
        this.loading.dismiss();
      }
    ).catch(err => {
      console.log(err)
      this.loading.dismiss();
    })

      this.loading = this.loadingCtrl.create();
      this.loading.present();
  }

  ngOnDestroy() {
    this.sub.unsubscribe(), err => {
      console.log(err.message)
    }
    console.log('ok');
      }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AnnoncesParCatégoriePage');
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
       return Number(Annonce.distance).toFixed(3)

     })
   }



}
