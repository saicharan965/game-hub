import { DOCUMENT } from '@angular/common';
import { Component, inject, Inject, OnDestroy, OnInit } from '@angular/core';
import { User, AuthService } from '@auth0/auth0-angular';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { UserFacadeService, CreateUserRequest } from '@game-hub/shared/domain-logic';

@Component({
  selector: 'game-hub-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  protected isLoggedIn = false;
  user?: User;
  private unsubscribe$: Subject<void> = new Subject();
  isSoundOn = true;
  #userFacade = inject(UserFacadeService);
  #toast = inject(ToastrService);

  constructor(private authService: AuthService, @Inject(DOCUMENT) public document: Document) { }

  protected logout() {
    this.authService.logout({ logoutParams: { returnTo: document.location.origin } });
  }

  public ngOnInit(): void {
    // this.soundService.getSoundState$().pipe(takeUntil(this.unsubscribe$)).subscribe((state) => {
    //   this.isSoundOn = state;
    // });

    this.authService.isAuthenticated$.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
      this.isLoggedIn = value;
      if (value !== true) {
        this.authService.loginWithRedirect();
      }
    });

    this.authService.user$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((user) => {
      if (user) {
        this.user = user;

        const createUserRequest = new CreateUserRequest({
          emailId: user.email,
          firstName: user.family_name,
          isActive: true,
          isDeleted: false,
          lastName: user.name,
          profilePictureUrl: user.picture
        });

        this.#userFacade.createUser(createUserRequest).pipe(takeUntil(this.unsubscribe$)).subscribe(
          (res) => {
            this.#toast.success(res.message);
          },
          (err) => {
            this.#toast.error('Failed to create user.');
          }
        );
      }
    });
  }

  // protected toggleSound(): void {
  //   this.soundService.toggleSound();
  // }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
