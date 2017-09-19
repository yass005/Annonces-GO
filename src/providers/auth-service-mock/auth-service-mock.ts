import { Injectable } from '@angular/core';

@Injectable()
export class MockAuthService {
  public authState: { isAnonymous: boolean, uid: string };

  constructor() {
    this.authState = { isAnonymous: true, uid: '0HjUd9owxPZ5kibvUCN6S2DgB4x1' };
  }

  // public get currentUser(): firebase.User {
  //   return this.authState ? this.authState : undefined;
  // }

  // public get currentUserObservable(): Observable<firebase.User> {
  //   return this.afAuth.authState;
  // }

  public get currentUid(): string {
    return this.authState ? this.authState.uid : undefined;
  }

  public get isAnonymous(): boolean {
    return this.authState ? this.authState.isAnonymous : false;
  }

  public get isAuthenticated(): boolean {
    return !!this.authState;
  }

  // public logout(): void {
  //   this.afAuth.auth.signOut();
  // }

  public test(isAnonymous: boolean) {
    this.authState.isAnonymous = isAnonymous;
  }
}
