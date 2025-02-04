import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { ChatService } from '@game-hub/shared/domain-logic';

interface ChatMessage {
  message: string;
  userEmail: string;
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
        this.#chatService.startConnection(user.email);
      }
    });

    this.#chatService.recivedMessage$.subscribe((message) => {
      console.log('📩 message received: ', message);
      this.messages.push({
        message: message.message,
        userEmail: message.user.emailId!
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
