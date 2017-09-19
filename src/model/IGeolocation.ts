import { Loc } from './location';
export interface IGeolocation{

  Position(): Promise<any>
  getDistanceBetweenPoints( Destination: Loc, units)
  toRad(x)
  AdressTolatitudelongitude(adress: string)
}
