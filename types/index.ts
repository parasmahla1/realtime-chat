export interface Message {
  _id?: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: Date;
}

export interface User {
  username: string;
  socketId: string;
}

export interface TypingEvent {
  sender: string;
  receiver: string;
  isTyping: boolean;
}