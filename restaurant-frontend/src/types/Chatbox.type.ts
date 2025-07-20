export interface ChatSession {
  _id: string;
  user_id: string;
  cashier_user_id?: string;
  status: 'open' | 'pending' | 'closed';
  created_at: string;
  updated_at: string;
  initiated_by: 'user' | 'cashier' | 'bot';
}

export interface ChatMessage {
  _id: string;
  chat_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  sent_at: string;
  read_at?: string;
  reply_to?: ChatMessage | null;
  sender_role: 'user' | 'cashier' | 'bot' | 'admin';
  is_deleted?: boolean;
  edited?: boolean;
  edited_at?: string;
  is_bot_reply?: boolean;
  message_type: 'text' | 'image' | 'file';
  reactions?: { emoji: string; userId?: string }[];
}

export interface SendMessagePayload {
  content: string;
  replyTo?: string;
}

export interface SendMessageAPIRequest {
  chatId: string;
  content: string;
  replyTo?: string;
  senderId?: string; 
  role?: 'user' | 'cashier'; 
}

export interface GetMessagesResponse {
  messages: ChatMessage[];
}

export interface ChatSessionResponse {
  _id: string;
  chat: ChatSession;
  user_id: string;
  cashier_user_id?: string;
  lastMessage?: ChatMessage | null;
  unreadCount?: number;
  lastMessageTime: string;
}
