// hooks/useAdminChatbox.ts
import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  getAllUserChats,
  getUserChatSession,
  getMessages,
  sendMessage,
  assignCashierSession,
} from '@/api/ChatboxApi';
import { ChatMessage, ChatSessionResponse } from '@/types/Chatbox.type';

const socket: Socket = io('http://localhost:4000', { withCredentials: true });

export const useAdminChatbox = () => {
  const [sessions, setSessions] = useState<ChatSessionResponse[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatSessionResponse | null>(
    null,
  );

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const init = async () => {
      const list = await getAllUserChats();
      console.log('Fetched chat sessions:', list);
      setSessions(list);
    };
    init();
  }, []);

  useEffect(() => {
    socket.on('message', (msg: ChatMessage) => {
      if (msg.chat_id === currentChat?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => {
      socket.off('message');
    };
  }, [currentChat]);

  const selectChat = async (userId: string) => {
    const session = await getUserChatSession(userId);
    
  // 👇 Gán cashier nếu chưa có
  if (!session.cashier_user_id) {
    await assignCashierSession(session._id);
    console.log('[✅ GÁN CASHIER] Đã gán bạn vào xử lý phiên chat');
  }
    setCurrentChat(session);
    const msgs = await getMessages(session._id);
    setMessages(msgs);
    socket.emit('join', {
      userId: 'cashier',
      chatId: session._id,
      roles: 'cashier',
    });
  };

  const handleSend = async (content: string) => {
    if (!currentChat || !content.trim()) return;
    const msg = await sendMessage({ chatId: currentChat._id, content });
    setMessages((prev) => [...prev, msg]);
  };

  return {
    sessions,
    currentChat,
    messages,
    selectChat,
    handleSend,
    messageEndRef,
    assignCashierSession
  };
};
