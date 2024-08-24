import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { lastValueFrom, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseUrlService } from './baseUrl.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket$: WebSocketSubject<any>;

  constructor(
    private baseUrlService: BaseUrlService,
    private httpClient: HttpClient
  ) {
    this.socket$ = webSocket('ws://localhost:5113/ws');
  }

  sendMessage(message: string, accountId: number) {
    this.socket$.next({ text: message, accountId: accountId });
  }

  onMessage(): Observable<any> {
    return this.socket$
      .asObservable()
      .pipe
      // Log messages received
      ();
  }

  close() {
    this.socket$.complete();
  }
  async findChatByAccountId(accountId: number): Promise<any> {
    return await lastValueFrom(
      this.httpClient.get(
        this.baseUrlService.getBaseUrl() +
          'chat/findChatByAccountId/' +
          accountId
      )
    );
  }
  async newChat(chat: any) : Promise<any>{
    return await lastValueFrom(this .httpClient.post(this.baseUrlService.getBaseUrl()
    + 'chat/newChat', chat));
 }
}
