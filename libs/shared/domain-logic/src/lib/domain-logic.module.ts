import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Environment } from './environment-types';
import { API_BASE_URL, Client } from './api.service';
import { SnakeFacadeService } from './snake-facade.service';
import { UserFacadeService } from './user-facade.service';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { TokenInterceptor } from './auth/token-interceptor.service';

@NgModule({
  imports: [CommonModule],
})
export class SharedDomainLogicModule {
  static forRoot(type: Environment): ModuleWithProviders<SharedDomainLogicModule> {
    return {
      ngModule: SharedDomainLogicModule,
      providers: [
        provideHttpClient(),
        {
          provide: API_BASE_URL,
          useFactory: () => {
            switch (type) {
              case Environment.Local:
              case Environment.Development:
                return 'http://localhost:5098';
              case Environment.Test:
                return 'http://localhost:5098';
              default:
                return 'http://localhost:5098';
            }
          },
        },
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        Client,
        SnakeFacadeService,
        UserFacadeService,
      ],
    };
  }
}
