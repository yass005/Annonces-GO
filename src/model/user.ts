import { Loc } from './location';
import { Adress } from './adress';
export interface User {
  key?:  string,
  firstName: string,
  lastName: string,
  adress: Adress,
  email: string,
  birthDate?: Date,
  position: Loc

}


