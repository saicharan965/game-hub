import { Component, Input } from '@angular/core';
import { UserDetailsResponse } from '@game-hub/shared/domain-logic';

@Component({
  selector: 'operations-global-chat-message-right',
  standalone: false,
  templateUrl: './message-right.component.html',
  styleUrl: './message-right.component.scss',
})
export class MessageRightComponent {
  @Input() message!: string;
  @Input() userDetails!: UserDetailsResponse;

}
