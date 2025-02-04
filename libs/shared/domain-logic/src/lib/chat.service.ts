import { Inject, Injectable, Optional } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { API_BASE_URL, UserDetailsResponse } from './api.service';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl: string;
  private hubConnection!: signalR.HubConnection;
  public recivedMessage$: Subject<{ message: string, user: UserDetailsResponse }> = new Subject<{ message: string, user: UserDetailsResponse }>();

  constructor(@Optional() @Inject(API_BASE_URL) baseUrl?: string) {
    this.baseUrl = baseUrl ? `http://localhost:5098/chatHub` : "";
    console.log('baseUrl', this.baseUrl);
  }

  startConnection(userId: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.baseUrl)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .catch(err => console.error('Connection error: ', err));

    this.hubConnection.on('GetPreviousChats', (messages: any[]) => {
      console.log(`📩 messages: ${messages}`);
    });

    this.hubConnection.on('ReceiveMessage', (user: UserDetailsResponse, message: string) => {
      this.recivedMessage$.next({ message, user });
    });
  }

  sendMessage(message: string, emailId: string) {
    this.hubConnection.invoke('SendMessage', emailId, message).catch(err =>
      console.error('❌ Send error: ', err)
    );
  }
}
