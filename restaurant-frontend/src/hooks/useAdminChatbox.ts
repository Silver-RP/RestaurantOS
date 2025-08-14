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
        // Kiểm tra xem có phải tin nhắn từ chính mình không (để tránh duplicate)
        const isMyMessage = msg.sender_id === currentChat?.cashier_user_id;
        const exists = messages.some((m) => m._id === msg._id);

        if (!exists) {
          // Nếu là tin nhắn của mình, kiểm tra xem có tin nhắn tạm thời tương ứng không
          if (isMyMessage) {
            const tempMessageIndex = messages.findIndex(m => {
              if (!m._id.startsWith('temp_')) return false;
              // So sánh content, loại tin nhắn, và mảng ảnh (nếu có)
              const sameContent = m.content === msg.content;
              const sameType = m.message_type === msg.message_type;
              if (m.message_type === 'image' && Array.isArray(m.image) && Array.isArray(msg.image)) {
                // So sánh số lượng và từng base64
                if (m.image.length !== msg.image.length) return false;
                for (let i = 0; i < m.image.length; i++) {
                  if (m.image[i] !== msg.image[i]) return false;
                }
                return sameContent && sameType;
              }
              return sameContent && sameType;
            });
            if (tempMessageIndex !== -1) {
              // Thay thế tin nhắn tạm thời bằng tin nhắn thật
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[tempMessageIndex] = msg;
                return newMessages;
              });
            } else {
              // Nếu không tìm thấy tin nhắn tạm thời, thêm tin nhắn mới
              setMessages(prev => [...prev, msg]);
            }
          } else {
            // Nếu là tin nhắn từ người khác, thêm bình thường
            setMessages(prev => [...prev, msg]);
          }
        }
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

  // ... existing code ...
  const handleSend = async (content: string, replyTo?: string, images?: string[]) => {
    if (!currentChat || (!content.trim() && (!images || images.length === 0))) return;

    try {
      await sendMessage({
        chatId: currentChat._id,
        content,
        replyTo,
        image: images,
      });
      // Không cần làm gì ở đây vì socket sẽ xử lý việc thay thế tin nhắn tạm thời
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || 'Đã xảy ra lỗi khi gửi tin nhắn';
      alert(errorMsg);
      console.error('[LỖI GỬI TIN NHẮN]', err);
    }
  };
  // ... existing code ...

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
    console.log('[MESSAGES WITH REPLY]', msgs.filter(m => m.reply_to));
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

  const totalUnreadCount = sessions.reduce((sum, s) => sum + (s.unreadCount ?? 0), 0);
  return {
    sessions,
    currentChat,
    messages,
    selectChat,
    handleSend,
    messageEndRef,
    assignCashierSession,
    totalUnreadCount,
    setMessages,
  };
};
