import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private _authService: AuthService) { }

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this._authService.getAccessTokenSilently()).pipe(
      switchMap(token => {
        return next.handle(httpRequest.clone({
          setHeaders: { authorization: `Bearer ${token}` }
        }));
      })
    );
  }
}
