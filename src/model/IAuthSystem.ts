
/*---------------------------interface pour authetification-------------------------------------*/
/*	Cette interface sert de modéle de base pour le service de l'authetification                 */
/*	Tous ses méthodes seront implémentées dans le service auth qui utilise le sdk de firebase 	*/
/*------------------------------------------------------------------------------------          */
export interface IAuthSytem {


  signupUser(email: string, password: string): firebase.Promise<any>
  getUser(): firebase.User
  logout()
  resetPassword(email: string): firebase.Promise<any>
  loginUser(email: string, password: string): firebase.Promise<any>
  facebookLogin(): Promise<any>
  googleLogin(): Promise<any>
  UpdateToken(userUid): Promise<any>

}
