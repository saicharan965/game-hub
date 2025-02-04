import { Route } from '@angular/router';
import { ChatComponent } from './chat/chat.component';

export const remoteRoutes: Route[] = [{ path: '', component: ChatComponent, pathMatch: 'full' }];
