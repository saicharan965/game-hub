import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { loadRemote } from '@module-federation/enhanced/runtime';
import { MainComponent } from './main.component';

const ROUTES: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'snake_master',
        loadChildren: () =>
          loadRemote<typeof import('snake_master/Module')>(
            'snake_master/Module'
          ).then((m) => m!.RemoteEntryModule),
      }
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class MainModule { }
