import { NxWelcomeComponent } from './nx-welcome.component';
import { Route } from '@angular/router';
import { loadRemote } from '@module-federation/enhanced/runtime';

export const appRoutes: Route[] = [
  {
    path: 'snake_master',
    loadChildren: () =>
      loadRemote<typeof import('snake_master/Module')>(
        'snake_master/Module'
      ).then((m) => m!.RemoteEntryModule),
  },
  {
    path: '',
    component: NxWelcomeComponent,
  },
];
