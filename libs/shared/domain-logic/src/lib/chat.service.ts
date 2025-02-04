import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // private baseUrl: string;
  // private hubConnection!: signalR.HubConnection;

  // constructor(@Optional() @Inject(API_BASE_URL) baseUrl?: string) {
  //   this.baseUrl = baseUrl ? `http://localhost:5098/chatHub` : "";
  //   console.log('baseUrl', this.baseUrl);
  // }

  // startConnection(userId: string) {
  //   this.hubConnection = new signalR.HubConnectionBuilder()
  //     .withUrl(this.baseUrl)
  //     .withAutomaticReconnect()
  //     .build();

  //   this.hubConnection
  //     .start()
  //     .then(() => {
  //       console.log('✅ SignalR Connected');
  //       this.registerUser(userId);
  //     })
  //     .catch(err => console.error('Connection error: ', err));

  //   this.hubConnection.on('ReceiveMessage', (sender: string, message: string) => {
  //     console.log(`📩 ${sender}: ${message}`);
  //   });

  // }

  // registerUser(userId: string) {
  //   this.hubConnection.invoke('RegisterUser', userId).catch(err =>
  //     console.error('❌ Register error: ', err)
  //   );
  // }

  // sendMessage(message: string, userId: string) {
  //   this.hubConnection.invoke('SendMessage', userId, message).catch(err =>
  //     console.error('❌ Send error: ', err)
  //   );
  // }
}
