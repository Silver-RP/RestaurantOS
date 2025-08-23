import React, { useState, useEffect, useRef } from 'react';
import { useChatbox } from '@/hooks/useUserChatbox';
import { useFaq } from '@/hooks/useFaq';
import { getAnswerByQuestion } from '@/api/FaqApi';
import { getUnreadMessageCount, getMessages, markMessageAsRead } from '@/api/ChatboxApi';
import { socket } from '@/utils/socket';
import ChatWindow from './ChatWindow';
import ChatToggleButton from './ChatToggleButton';
import { toast } from 'react-toastify';
import { isAuthenticated } from '@/utils/tokenHelpers';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  message_type?: 'text' | 'image' | 'file';
  attachments?: string[];
}

const Chatbox: React.FC = () => {
  const {
    messages: realMessages,
    handleSend: sendRealMessage,
    chatId,
    userId,
  } = useChatbox();

  const { faqs } = useFaq();
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Kiểm tra role của user
  const hasAdminRole = () => {
    const roles = userInfo?.roles ?? [];
    if (!Array.isArray(roles) || roles.length === 0) return false;

    return roles.some((roleItem) => {
      // roleItem có thể là string hoặc object { name: string }
      const name = typeof roleItem === 'string' ? roleItem : roleItem?.name;
      console.log('User role chatbox:', name);

      return typeof name === 'string' && name.toLowerCase() === 'admin'
        || typeof name === 'string' && ['cashier','manager','superadmin'].includes(name.toLowerCase());
    });
  };

  useEffect(() => {
    if (!isOpen) {
      const fetchUnread = async () => {
        try {
          const count = await getUnreadMessageCount();
          console.log('Unread messages count:', count);
          setUnreadCount(count);
        } catch {
          setUnreadCount(0);
        }
      };
      fetchUnread();
    }
  }, [isOpen]);

  // Lắng nghe socket: khi có tin nhắn mới và chatbox đang đóng, cập nhật badge
  useEffect(() => {
    const handleSocketMessage = async () => {
      if (!isOpen) {
        const count = await getUnreadMessageCount();
        setUnreadCount(count);
      }
    };
    socket.on('message', handleSocketMessage);
    return () => {
      socket.off('message', handleSocketMessage);
    };
  }, [isOpen]);
  
  const [input, setInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const isSending = useRef(false);

  const toggleShowInput = () => setShowInput((prev) => !prev);
  
  const toggleChat = () => {
    if (!isAuthenticated()) {
      toast.error('Bạn vui lòng đăng nhập để sử dụng chatbox');
      return;
    }
    
    // Kiểm tra role và chuyển hướng phù hợp
    if (hasAdminRole()) {
      // Nếu là admin/cashier, chuyển đến admin chat panel
      navigate('/admin/chatbox');
      return;
    }
    
    // Nếu là user thường, mở chat user
    setIsOpen(!isOpen);
    setShowInput(false);
  };

  const handleFAQClick = (question: string) => {
    console.log('đã click câu trả lời');
    
    const matched = faqs.find(faq => faq.question.trim().toLowerCase() === question.trim().toLowerCase());
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: question },
      {
        sender: 'bot',
        text: matched?.answer || 'Xin lỗi, tôi chưa có câu trả lời phù hợp.',
      },
    ]);
  };

  const handleSend = async (replyToId?: string, attachments?: string[]) => {
    if ((!input.trim() && (!attachments || attachments.length === 0)) || isSending.current) return;

    const messageToSend = input;
    setInput('');
    isSending.current = true;

    try {
      if (showInput && chatId) {
        await sendRealMessage(messageToSend, replyToId, attachments);
      } else {
        const matched = await getAnswerByQuestion(messageToSend);
        setMessages((prev) => [
          ...prev,
          { sender: 'user', text: messageToSend },
          {
            sender: 'bot',
            text: matched?.answer || 'Xin lỗi, tôi chưa có câu trả lời phù hợp.',
          },
        ]);
      }
    } finally {
      isSending.current = false;
    }
  };

  useEffect(() => {
    const markAllAsRead = async () => {
      if (isOpen && chatId) {
        try {
          // Lấy danh sách tin nhắn chưa đọc
          const allMessages = await getMessages(chatId);
          const unreadMessages = allMessages.filter((msg) => {
            const readAt = (msg as { read_at?: string | null }).read_at;
            const sender = (msg as { sender?: 'user' | 'bot' | string }).sender;
            return !readAt && sender !== 'user';
          });
          for (const msg of unreadMessages) {
            await markMessageAsRead(chatId, msg._id);
          }
        } catch (err) {
          console.error('Lỗi đánh dấu đã đọc:', err);
        }
        setUnreadCount(0);
      }
    };
    markAllAsRead();
  }, [isOpen, chatId]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <ChatWindow
          messages={showInput ? realMessages : messages}
          input={input}
          onInputChange={setInput}
          onSend={(replyToId?: string, attachments?: string[]) => handleSend(replyToId, attachments)}
          onClose={toggleChat}
          showInput={showInput}
          onShowInput={toggleShowInput}
          onFAQClick={handleFAQClick}
          faqList={faqs.map((f) => f.question)}
          currentUserId={userId ?? undefined}
          chatId={chatId ?? undefined}
          faqs={faqs}
          onInputKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
        />
      ) : (
        <ChatToggleButton unreadCount={unreadCount} onClick={toggleChat} />
      )}

    
    </div>
  );
};

export default Chatbox;
