import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RemoteEntryComponent } from './entry.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { remoteRoutes } from './entry.routes';
import { ChatComponent } from './chat/chat.component';

@NgModule({
    declarations: [RemoteEntryComponent, NxWelcomeComponent, ChatComponent],
    imports: [CommonModule, RouterModule.forChild(remoteRoutes)],
    providers: [],
})
export class RemoteEntryModule {}
