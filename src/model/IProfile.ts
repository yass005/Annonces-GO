
/*---------------------------interface pour le profil utilisateur-------------------------------------*/
/*	Cette interface sert de modéle de base pour le service profil utilisateur                        */
/*	Tous ses méthodes seront implémentées dans le service profil qui utilise le sdk de firebase   	*/
/*------------------------------------------------------------------------------------             */
import { FirebaseListObservable } from 'angularfire2/database';
export interface IProfile {


  getUserProfile(): firebase.database.Reference
  RemoveFavoris(key : string) : firebase.Promise<any>
  getFavoris() : FirebaseListObservable<any>
  updateName(firstName: string, lastName: string): firebase.Promise<void>
  updatePosition(lat: number, lng: number): firebase.Promise<void>
  AddFavoris(key: string): firebase.Promise<void>
  updateAdresse(rue: string, num : number,  ville: string): firebase.Promise<void>
  updateDOB(birthDate: string): firebase.Promise<any>
  updateEmail(newEmail: string, password: string): firebase.Promise<any>
  updatePassword(newPassword: string, oldPassword: string): firebase.Promise<any>
  DeleteUser(Password: string): firebase.Promise<any>
}
