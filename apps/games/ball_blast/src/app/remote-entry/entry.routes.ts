import { Route } from '@angular/router';
import { RemoteEntryComponent } from './entry.component';
import { AchivementsComponent } from './achivements/achivements.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { NewGameComponent } from './new-game/new-game.component';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RemoteEntryComponent,
    children: [
      {
        path: '',
        component: MainMenuComponent
      },
      {
        path: 'new',
        component: NewGameComponent
      },
      {
        path: 'leaderboards',
        component: LeaderboardComponent
      },
      {
        path: 'achievements',
        component: AchivementsComponent
      }
    ]
  },
];
