import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// tslint:disable-next-line:no-unused-variable

import { User } from '../../model/user';


@Injectable()
export class AuthServiceMock {
user: BehaviorSubject<User>;
constructor() {
this.user = new BehaviorSubject<User>(null);
}

create(user: User) {
this.logIn(user);
return Promise.resolve(user);
}
logIn(user: User) {
this.user.next(user);
}
logOut() {
this.user.next(null);
}
}
