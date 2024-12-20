import { DOCUMENT } from '@angular/common';
import { Component, inject, Inject, OnDestroy, OnInit } from '@angular/core';
import { User, AuthService } from '@auth0/auth0-angular';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { UserFacadeService, CreateUserRequest } from '@game-hub/shared/domain-logic';

@Component({
  selector: 'game-hub-main',
  standalone: false,
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit, OnDestroy {
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
        this.#userFacade.createUser(new CreateUserRequest({
          emailId: user.email,
          isActive: true,
          isDeleted: false,
          name: user.name,
          profilePictureUrl: user.picture
        })).pipe(takeUntil(this.unsubscribe$)).subscribe(
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

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

