import { Component } from '@angular/core';

@Component({
    selector: 'operations-global-chat',
    standalone: false,
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.scss',
    host: {
      'class': 'd-flex flex-grow-1 flex-column',
      'style': 'min-height: 0'
  }
})
export class ChatComponent {}
