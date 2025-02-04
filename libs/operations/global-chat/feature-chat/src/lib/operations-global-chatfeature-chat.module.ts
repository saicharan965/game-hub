import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperationsGlobalChatFeatureChatComponent } from './feature-chat/feature-chat.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [OperationsGlobalChatFeatureChatComponent],
    imports: [CommonModule, FormsModule],
    exports: [OperationsGlobalChatFeatureChatComponent],
    providers: [],
})
export class OperationsGlobalChatfeatureChatModule {}
