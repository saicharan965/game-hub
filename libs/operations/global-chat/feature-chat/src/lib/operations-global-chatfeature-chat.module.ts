import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperationsGlobalChatFeatureChatComponent } from './feature-chat/feature-chat.component';
import { FormsModule } from '@angular/forms';
import { MessageRightComponent } from './message-right/message-right.component';
import { MessageLeftComponent } from './message-left/message-left.component';

@NgModule({
    declarations: [OperationsGlobalChatFeatureChatComponent, MessageRightComponent, MessageLeftComponent],
    imports: [CommonModule, FormsModule],
    exports: [OperationsGlobalChatFeatureChatComponent],
    providers: [],
})
export class OperationsGlobalChatfeatureChatModule {}
