import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RemoteEntryComponent } from './entry.component';
import { remoteRoutes } from './entry.routes';
import { FeatureSnakeMasterModule } from '@game-hub/games/feature-snake-master';

@NgModule({
  declarations: [RemoteEntryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(remoteRoutes),
    FeatureSnakeMasterModule
  ],
  providers: [],
})
export class RemoteEntryModule { }
