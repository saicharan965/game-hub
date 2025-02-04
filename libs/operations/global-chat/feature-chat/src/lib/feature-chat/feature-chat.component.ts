import { Component, OnInit, inject } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { ChatService } from '@game-hub/shared/domain-logic';
@Component({
  selector: 'operations-global-chat-feature-chat',
  standalone: false,
  templateUrl: './feature-chat.component.html',
  styleUrl: './feature-chat.component.scss',
})
export class OperationsGlobalChatFeatureChatComponent implements OnInit {
  protected inputMessage = '';
  protected user!: User
  #chatService = inject(ChatService);
  #authService = inject(AuthService);
  ngOnInit(): void {
    this.#authService.user$.subscribe((user) => {

      if (user && user.name) {
        this.user = user;
        this.#chatService.startConnection(user.name);
      }
    })
  }
  sendMessage() {
    this.#chatService.sendMessage(this.inputMessage, this.user.email!);
    this.inputMessage = '';
  }
}
