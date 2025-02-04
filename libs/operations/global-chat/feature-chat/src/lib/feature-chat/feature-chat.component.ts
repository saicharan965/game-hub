import { Component } from '@angular/core';

@Component({
  selector: 'operations-global-chat-feature-chat',
  standalone: false,
  templateUrl: './feature-chat.component.html',
  styleUrl: './feature-chat.component.scss',
})
export class OperationsGlobalChatFeatureChatComponent {
  // #chatService = inject(ChatService);
  // #authService = inject(AuthService);
  // ngOnInit(): void {
  //   this.#authService.user$.subscribe((user) => {
  //     // if (user && user.name) this.#chatService.startConnection(user.name);
  //   })
  // }
}
