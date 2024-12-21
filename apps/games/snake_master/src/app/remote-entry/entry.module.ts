import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RemoteEntryComponent } from './entry.component';
import { remoteRoutes } from './entry.routes';
import { FeatureSnakeMasterModule } from '@game-hub/games/feature-snake-master';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { NewGameComponent } from './new-game/new-game.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { AchivementsComponent } from './achivements/achivements.component';

@NgModule({
    declarations: [
        RemoteEntryComponent,
        MainMenuComponent,
        NewGameComponent,
        NewGameComponent,
        LeaderboardComponent,
        AchivementsComponent,
        AchivementsComponent,
    ],
    imports: [CommonModule, RouterModule.forChild(remoteRoutes), FeatureSnakeMasterModule],
    providers: [],
})
export class RemoteEntryModule {}
