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
    const handleMessage = async (msg: ChatMessage) => {
      if (msg.chat_id === currentChat?._id) {
        const exists = messages.some((m) => m._id === msg._id);
        if (!exists) setMessages((prev) => [...prev, msg]);
      }
      const list = await getAllUserChats();
      setSessions(list);
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

    try {
      await sendMessage({ chatId: currentChat._id, content });
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || 'Đã xảy ra lỗi khi gửi tin nhắn';
      alert(errorMsg); 
      console.error('[LỖI GỬI TIN NHẮN]', err);
    }
  };

  const selectChat = async (userId: string) => {
    const session = await getUserChatSession(userId);
    console.log('[SESSION USER]', session);

    if (!session.cashier_user_id) {
      await assignCashierSession(session._id);
      console.log('[GÁN CASHIER] Đã gán bạn vào xử lý phiên chat');
    }

    setCurrentChat(session);

    const msgs = await getMessages(session._id);
    console.log('[MESSAGES]', msgs);
    setMessages(msgs);

    // Đánh dấu tất cả tin nhắn chưa đọc từ user là đã đọc
    try {
      const { markMessageAsRead } = await import('@/api/ChatboxApi');
      const unreadMsgs = msgs.filter(m => !m.read_at && m.sender_role === 'user');
      for (const msg of unreadMsgs) {
        await markMessageAsRead(session._id, msg._id);
      }
    } catch (err) {
      console.error('[LỖI ĐÁNH DẤU ĐÃ ĐỌC]', err);
    }

    // Sau khi đánh dấu đã đọc, gọi lại API lấy danh sách chat để cập nhật badge
    const updatedSessions = await getAllUserChats();
    setSessions(updatedSessions);

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('join', {
      userId: 'cashier',
      chatId: session._id,
      roles: 'cashier',
    });
    console.log('[SOCKET JOIN]', { userId: 'cashier', chatId: session._id, roles: 'cashier' });
  };
  console.log('[DANH SÁCH PHIÊN CHAT]', sessions);
  
  const totalUnreadCount = sessions.reduce((sum, s) => sum + (s.unreadCount ?? 0), 0);
  console.log('[TỔNG SỐ TIN NHẮN CHƯA ĐỌC]', totalUnreadCount);
  
  return {
    sessions,
    currentChat,
    messages,
    selectChat,
    handleSend,
    messageEndRef,
    assignCashierSession,
    totalUnreadCount,
  };
};
