import { socket } from '@utils/socket';
import { ChatMessage } from '@/types/Chatbox.type';
import { useEffect, useRef, useState } from 'react';
import { getChatSession, getMessages, sendMessage } from '@/api/ChatboxApi';

export const useChatbox = () => {
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [typingUserId, setTypingUserId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const isSending = useRef(false);
  const hasMore = useRef(true);
  const loadingMore = useRef(false);

  useEffect(() => {
    const init = async () => {
      try {
        const chat = await getChatSession();
        setChatId(chat._id);
        setUserId(chat.user_id);

        socket.connect();

        socket.emit('join', {
          userId: chat.user_id,
          chatId: chat._id,
          roles: 'user',
        });

        console.log('🔄 Đang tải tin nhắn...');
        const fetchedMessages = await getMessages(chat._id);
        console.log('✅ Messages loaded:', fetchedMessages.length);
        setMessages(fetchedMessages);
      } catch (error: unknown) {
        console.error('❌ Lỗi khởi tạo chat:', error);
        const err = error as { response?: { status?: number; statusText?: string }; message?: string; config?: { url?: string; method?: string }; code?: string };
        console.error('❌ Error details:', {
          status: err?.response?.status,
          statusText: err?.response?.statusText,
          message: err?.message,
          url: err?.config?.url,
          method: err?.config?.method,
        });

        // Kiểm tra các lỗi phổ biến
        if (err?.response?.status === 404) {
          console.error('❌ API endpoint không tồn tại hoặc server chưa chạy');
        } else if (err?.response?.status === 401) {
          console.error('❌ Token không hợp lệ hoặc hết hạn');
        } else if (err?.code === 'NETWORK_ERROR') {
          console.error('❌ Không thể kết nối đến server');
        }
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    socket.on('message', (msg: ChatMessage) => {
      setMessages((prev) => {
        const alreadyExists = prev.some((m) => m._id === msg._id);
        if (alreadyExists) return prev;
        return [...prev, msg];
      });
    });

    socket.on('typing', ({ userId, typing }) => {
      setTypingUserId(typing ? userId : null);
    });

    socket.on('messageReactionUpdated', ({ messageId, reactions }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, reactions } : msg
        )
      );
    });

    return () => {
      socket.off('message');
      socket.off('typing');
      socket.off('messageReactionUpdated');
    };
  }, []);

  // attachments: image, audio
  const handleSend = async (content: string, replyTo?: string, attachments?: string[], audio?: string[]) => {
    if (!chatId || (!content.trim() && (!attachments || attachments.length === 0) && (!audio || audio.length === 0)) || isSending.current) return;

    isSending.current = true;
    try {
      const sentMsg = await sendMessage({
        chatId,
        content,
        replyTo,
        senderId: userId ?? undefined,
        role: 'user',
        image: attachments,
        audio: audio,
      });
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === sentMsg._id);
        return exists ? prev : [...prev, sentMsg];
      });
    } catch (error) {
      console.error('Send message failed:', error);
    } finally {
      isSending.current = false;
    }
  };

  const loadMoreMessages = async () => {
    if (!chatId || loadingMore.current || !hasMore.current) return;
    loadingMore.current = true;

    const oldestMsgId = messages[0]?._id;
    const olderMessages = await getMessages(chatId, oldestMsgId);

    if (olderMessages.length === 0) {
      hasMore.current = false;
    } else {
      setMessages((prev) => [...olderMessages, ...prev]);
    }

    loadingMore.current = false;
  };

  return {
    chatId,
    userId,
    messages,
    loading,
    typingUserId,
    handleSend,
    loadMoreMessages,
  };
};
