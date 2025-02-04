import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
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
  protected user!: User;
  @ViewChild('chatMessagesContainer', { static: true }) public chatContainer?: ElementRef;
  #chatService = inject(ChatService);
  #authService = inject(AuthService);
  ngOnInit(): void {
    this.#authService.user$.subscribe((user) => {
      if (user && user.name) {
        this.user = user;
        this.#chatService.startConnection(user.name);
      }
    })

    this.#chatService.recivedMessage$.subscribe((message) => {
      console.log('📩 message: ', message)
      if (this.chatContainer) {
        const div = document.createElement('div');
        div.className = 'chat-message';
        div.innerHTML = `<p> ${message.message}</p>`;
        this.chatContainer.nativeElement.appendChild(div);
      }
    })
  }
  sendMessage() {
    this.#chatService.sendMessage(this.inputMessage, this.user.email!);
    this.inputMessage = '';
  }
}
