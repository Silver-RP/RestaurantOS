import { io, Socket } from 'socket.io-client';
import { ChatMessage } from '@/types/Chatbox.type';
import { useEffect, useRef, useState } from 'react';
import { getChatSession, getMessages, sendMessage } from '@/api/ChatboxApi';

const socket: Socket = io('http://localhost:4000', {
  withCredentials: true,
});

export const useChatbox = () => {
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [typingUserId, setTypingUserId] = useState<string | null>(null);

  const hasMore = useRef(true);
  const loadingMore = useRef(false);
  // Load phiên chat và tin nhắn lần đầu

  useEffect(() => {
    const init = async () => {
      try {
        const chat = await getChatSession();
        setChatId(chat._id);

        socket.emit('join', {
          userId: chat.user_id,
          chatId: chat._id,
          roles: 'user',
        });

        const fetchedMessages = await getMessages(chat._id);
        setMessages(fetchedMessages);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    socket.on('message', (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('typing', ({ userId, typing }) => {
      setTypingUserId(typing ? userId : null);
    });

    return () => {
      socket.off('message');
      socket.off('typing');
    };
  }, []);
  const handleSend = async (content: string, replyTo?: string) => {
    if (!chatId || !content.trim()) return;
    const msg = await sendMessage({ chatId, content, replyTo });
    console.log('Sent message', msg);
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
    messages,
    loading,
    typingUserId,
    handleSend,
    loadMoreMessages,
  };
};
