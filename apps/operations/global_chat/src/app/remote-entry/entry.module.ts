import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { remoteRoutes } from './entry.routes';
import { ChatComponent } from './chat/chat.component';
import { OperationsGlobalChatfeatureChatModule } from '@game-hub/operations/global-chat/feature-chat';

@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(remoteRoutes),
    OperationsGlobalChatfeatureChatModule
  ],
  providers: [],
})
export class RemoteEntryModule {}
