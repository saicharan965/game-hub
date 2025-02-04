import { Component, Input } from '@angular/core';

@Component({
  selector: 'operations-global-chat-message-right',
  standalone: false,
  templateUrl: './message-right.component.html',
  styleUrl: './message-right.component.scss',
})
export class MessageRightComponent {
  @Input() message!: string;
}
