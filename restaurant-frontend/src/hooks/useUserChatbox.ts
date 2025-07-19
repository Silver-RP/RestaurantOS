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
      socket.off('messageReactionUpdated'); // Cleanup
    };
  }, []);

  const handleSend = async (content: string, replyTo?: string) => {
    if (!chatId || !content.trim() || isSending.current) return;

    isSending.current = true;
    try {
      await sendMessage({
        chatId,
        content,
        replyTo,
        senderId: userId ?? undefined,
        role: 'user',
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
