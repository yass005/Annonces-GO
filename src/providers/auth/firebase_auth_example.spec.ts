import { LoginPage } from './../../pages/login/login';
import {AuthProvider} from './auth';
import { inject, TestBed } from '@angular/core/testing';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import 'rxjs/add/observable/of';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

const authState: firebase.User = null;
const mockAngularFireAuth: any = { authState: Observable.of(authState) };

export const firebaseConfig = {
  apiKey: "AIzaSyB6s6vyLqyo9EaN2xqDpHa0WBu4tKFzwgo",
    authDomain: "annonces-go.firebaseapp.com",
    databaseURL: "https://annonces-go.firebaseio.com",
    projectId: "annonces-go",
    storageBucket: "annonces-go.appspot.com",
    messagingSenderId: "240356183666"
};

describe('AuthProvider', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AngularFireModule.initializeApp(firebaseConfig)],
      providers: [
        { provider: AngularFireAuth, useValue: mockAngularFireAuth },
        AuthProvider
      ]
    });
  });

  it('should be defined', inject([ AuthProvider ], (service: AuthProvider) => {
    expect(service).toBeDefined();
  }));

  it('.authState should be null', inject([ AuthProvider ], (service: AuthProvider) => {
expect(Reflect.get(service, 'authState')).toBe(null);
  }));

it('should log user in',
    inject([LoginPage], (app: LoginPage) => {
      expect(app.authProvider.loginUser).toHaveBeenCalled();
    })
  );

  it('should log user out',
    inject([LoginPage], (app: LoginPage) => {
      expect(app.authProvider.facebookLogin).toHaveBeenCalled();
    })
  );
});
