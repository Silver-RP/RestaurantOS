import { useEffect, useState, useRef } from 'react';
import {
  getAllUserChats,
  getUserChatSession,
  getMessages,
  sendMessage,
  assignCashierSession,
} from '@/api/ChatboxApi';
import { ChatMessage, ChatSessionResponse } from '@/types/Chatbox.type';
import { socket } from '@/utils/socket';

export const useAdminChatbox = () => {
  const [sessions, setSessions] = useState<ChatSessionResponse[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatSessionResponse | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const init = async () => {
      const list = await getAllUserChats();
      setSessions(list);
    };
    init();
  }, []);

  useEffect(() => {
    const handleMessage = (msg: ChatMessage) => {
      if (msg.chat_id === currentChat?._id) {
        const exists = messages.some((m) => m._id === msg._id);
        if (!exists) setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on('message', handleMessage);
    return () => {
      socket.off('message', handleMessage);
    };
  }, [currentChat, messages]);

  useEffect(() => {
    socket.on('messageReactionUpdated', ({ messageId, reactions }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, reactions } : msg
        )
      );
    });

    return () => {
      socket.off('messageReactionUpdated');
    };
  }, []);

  const handleSend = async (content: string) => {
    if (!currentChat || !content.trim()) return;
    await sendMessage({ chatId: currentChat._id, content });
  };

  const selectChat = async (userId: string) => {
    const session = await getUserChatSession(userId);

    if (!session.cashier_user_id) {
      await assignCashierSession(session._id);
      console.log('[GÁN CASHIER] Đã gán bạn vào xử lý phiên chat');
    }

    setCurrentChat(session);

    const msgs = await getMessages(session._id);
    setMessages(msgs);

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('join', {
      userId: 'cashier',
      chatId: session._id,
      roles: 'cashier',
    });
  };

  return {
    sessions,
    currentChat,
    messages,
    selectChat,
    handleSend,
    messageEndRef,
    assignCashierSession,
  };
};
