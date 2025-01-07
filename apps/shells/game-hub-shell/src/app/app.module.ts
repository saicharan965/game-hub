import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Route, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard, AuthModule } from '@auth0/auth0-angular';
import { environment } from '../env/env.local';
import { SharedDomainLogicModule, Environment } from '@game-hub/shared/domain-logic';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { MainComponent } from './main/main.component';

const ROUTES: Route[] = [
  {
    path: '',
    loadChildren: () => import('./main/main.module').then(m => m.MainModule),
    canActivate: [AuthGuard],
  }
];

@NgModule({
  declarations: [AppComponent, MainComponent, MainComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES),
    SharedDomainLogicModule.forRoot(environment.type as Environment),
    AuthModule.forRoot({
      domain: environment.auth.domain,
      clientId: environment.auth.clientId,
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: `https://${environment.auth.domain}/api/v2/`,
      },
    }),
    ToastrModule.forRoot(),
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent],
})
export class AppModule { }
