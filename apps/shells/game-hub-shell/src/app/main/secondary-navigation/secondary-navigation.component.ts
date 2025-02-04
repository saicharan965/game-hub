import { Component } from '@angular/core';

@Component({
  selector: 'game-hub-secondary-navigation',
  standalone: false,
  templateUrl: './secondary-navigation.component.html',
  styleUrl: './secondary-navigation.component.scss',
})
export class SecondaryNavigationComponent {
  showChat = false
  protected toggleChat() {
    this.showChat = !this.showChat
   }

}
