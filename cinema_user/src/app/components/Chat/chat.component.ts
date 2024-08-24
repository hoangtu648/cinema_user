import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Account } from 'src/app/models/account.model';
import { Chat } from 'src/app/models/chat.model';
import { Message } from 'src/app/models/message.mode';
import { ChatService } from 'src/app/services/chatService.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: Chat[];

  newMessage: string = '';
  account: Account;
  constructor(private chatService: ChatService,
    private datePipe: DatePipe
    ) {}
  toDay: Date = new Date();
  ngOnInit(): void {
    this.account =  JSON.parse(localStorage.getItem("account"));
    this.chatService.findChatByAccountId(this.account.id).then(
      res => {
        this.messages = res as Chat[];
        console.log(res);
      }
    );
    this.chatService.onMessage().subscribe({
      next: (message: any) => {
        console.log(message.accountId);
        console.log(message);
        if(message.accountId != this.account.id){
          var chat: Chat = {
            message:  message.text ,
            role: 0,
            time: null,
            accountId: null,
            name: null
          };
          this.messages.push(chat);
        }
       
      
      },
      error: (error: any) => {
        console.error('WebSocket error', error);
      },
      complete: () => {
        console.log('WebSocket connection closed');
      }
    });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.newMessage, this.account.id);
      var chat: Chat = {
        message:  this.newMessage,
        role: 1,
        time: this.datePipe.transform(this.toDay, 'dd/MM/yyyy HH:mm:ss'),
        accountId: this.account.id,
        name: 'aaa'
      };
      this.messages.push(chat);
      this.chatService.newChat(chat).then(
        res => {
          console.log(res);
        }
      );
      this.newMessage = '';
    }
  }
}
