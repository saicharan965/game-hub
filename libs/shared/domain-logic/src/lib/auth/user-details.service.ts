import { Injectable } from '@angular/core';
import { User } from '@auth0/auth0-angular';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class CurrentUserDetails {
  public userDetails$!: Observable<User>;
  private userDetailsSubject: BehaviorSubject<User>;
  constructor() {
    this.userDetailsSubject = new BehaviorSubject<User>(new User());
    this.userDetails$ = this.userDetailsSubject.asObservable();
  }

  public setCurrentUser(user: User): void {
    this.userDetailsSubject.next(user);
  }
  public getCurrentUser(): User {
    return this.userDetailsSubject.value;
  }
}
