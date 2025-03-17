import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { ChatService, UserDetailsResponse } from '@game-hub/shared/domain-logic';

interface ChatMessage {
  message: string;
  userDetails: UserDetailsResponse;
}

@Component({
  selector: 'operations-global-chat-feature-chat',
  standalone: false,
  templateUrl: './feature-chat.component.html',
  styleUrl: './feature-chat.component.scss',
})
export class OperationsGlobalChatFeatureChatComponent implements OnInit {
  protected inputMessage = '';
  protected user!: User;
  protected messages: ChatMessage[] = [];

  @ViewChild('chatMessagesContainer') chatContainer?: ElementRef;

  #chatService = inject(ChatService);
  #authService = inject(AuthService);

  ngOnInit(): void {
    this.#authService.user$.subscribe((user) => {
      if (user && user.email) {
        this.user = user;
        this.#chatService.startConnection();
      }
    });

    this.#chatService.recivedMessage$.subscribe((receivedMessage) => {
      console.log('📩 message received: ', receivedMessage);
      this.messages.push({
        message: receivedMessage.message,
        userDetails: receivedMessage.user,
      });

      setTimeout(() => {
        if (this.chatContainer) {
          this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
        }
      });
    });
  }

  sendMessage() {
    if (!this.inputMessage.trim()) return;
    this.#chatService.sendMessage(this.inputMessage, this.user.email!);
    this.inputMessage = '';
  }
}
