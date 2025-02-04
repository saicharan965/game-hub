import { UserDetailsResponse } from '@game-hub/shared/domain-logic';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'operations-global-chat-message-left',
  standalone: false,
  templateUrl: './message-left.component.html',
  styleUrl: './message-left.component.scss',
})
export class MessageLeftComponent {
  @Input() message!: string;
  @Input() userDetails!: UserDetailsResponse;
}
