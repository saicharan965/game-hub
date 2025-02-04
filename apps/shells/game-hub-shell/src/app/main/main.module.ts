import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { loadRemote } from '@module-federation/enhanced/runtime';
import { MainComponent } from './main.component';
import { SecondaryNavigationComponent } from './secondary-navigation/secondary-navigation.component';

const ROUTES: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: SecondaryNavigationComponent,
        children: [
          {
            path: '',
            outlet: 'chat',
            loadChildren: () =>
              loadRemote<typeof import('global_chat/Module')>('global_chat/Module').then((m) => m!.RemoteEntryModule),
          },
          {
            path: '',
            redirectTo:'snake-master',
            pathMatch: 'full'
          },
          {
            path: 'snake-master',
            loadChildren: () =>
              loadRemote<typeof import('snake_master/Module')>('snake_master/Module').then((m) => m!.RemoteEntryModule),
          },
          {
            path: 'ball-blast',
            loadChildren: () =>
              loadRemote<typeof import('ball_blast/Module')>('ball_blast/Module').then((m) => m!.RemoteEntryModule),
          },
        ]
      }
    ],
  },
];

@NgModule({
  declarations: [SecondaryNavigationComponent],
  imports: [CommonModule, RouterModule.forChild(ROUTES)],
})
export class MainModule { }
