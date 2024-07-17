import { Component, ViewChild, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit{

  @ViewChild('mydiv') mydiv:any;
  items:Array<any> =[];

  ngOnInit(){
    let i : any;
    for(i=0; i<i.length; i++){
      this.items.push('items' + i)
    }

  }
  scrollButton(){
    this.mydiv.nativeElement.scrollTop = this.mydiv.nativeElement.scrollHeight;
  }

  userName = '';
  message = '';
  messageList : {message: string, userName: string, mine: boolean}[] = [];
  userList: string[] =[];
  socket: any;

  constructor() { }


  userNameUpdate(name: string){
    this.socket = io.io(`localhost:3000?userName=${name}`)
    this.userName = name;

    this.socket.emit('set-user-name', name);

    this.socket.on('user-list', (userList:string[]) => {
      this.userList=userList;
    });

    this.socket.on('message-broadcast',(data: {message: string, userName: string}) => {
      if(data){
        this.messageList.push({message: data.message, userName: data.userName, mine: false});
      }
    });


    
  }

  sendMessage():void{
    this.socket.emit('message', this.message);
    this.messageList.push({message: this.message, userName: this.userName, mine: true});
    this.message = '';
  }
  
  
}
