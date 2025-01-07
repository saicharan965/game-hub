import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RemoteEntryComponent } from './entry.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { remoteRoutes } from './entry.routes';
import { AchivementsComponent } from './achivements/achivements.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { NewGameComponent } from './new-game/new-game.component';
import { FeatureBallBlastModule } from '@game-hub/games/feature-ball-blast';

@NgModule({
  declarations: [
    RemoteEntryComponent,
    NxWelcomeComponent,
    AchivementsComponent,
    LeaderboardComponent,
    MainMenuComponent,
    NewGameComponent,
  ],
  imports: [CommonModule,
    FeatureBallBlastModule,
    RouterModule.forChild(remoteRoutes)],
  providers: [],
})
export class RemoteEntryModule { }
