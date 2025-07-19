import React, { useEffect, useState, useRef } from 'react';
import ChatToggleButton from './ChatToggleButton';
import ChatWindow from './ChatWindow';
import { useFaq } from '@/hooks/useFaq';
import { getAnswerByQuestion } from '@/api/FaqApi';
import { useChatbox } from '@/hooks/useUserChatbox';

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
  console.log('danh sach', faqs);
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(3);
  const [input, setInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [messageReactions, setMessageReactions] = useState<{ [key: string]: string }>({});

  const isSending = useRef(false);

  const toggleShowInput = () => setShowInput((prev) => !prev);
  const toggleChat = () => {
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

  const handleSend = async () => {
    if (!input.trim() || isSending.current) return;

    const messageToSend = input;
    setInput('');
    isSending.current = true;

    try {
      if (showInput && chatId) {
        await sendRealMessage(messageToSend); 
      } else {
        const matched = await getAnswerByQuestion(messageToSend);
        setMessages((prev) => [
          ...prev,
          { sender: 'user', text: messageToSend },
          {
            sender: 'bot',
            text:
              matched?.answer || 'Xin lỗi, tôi chưa có câu trả lời phù hợp.',
          },
        ]);
      }
    } finally {
      isSending.current = false;
    }
  };

  useEffect(() => {
    if (isOpen) setUnreadCount(0);
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <ChatWindow
          messages={showInput ? realMessages : messages}
          input={input}
          onInputChange={setInput}
          onSend={handleSend}
          onClose={toggleChat}
          showInput={showInput}
          onShowInput={toggleShowInput}
          onFAQClick={handleFAQClick}
          faqList={faqs.map((f) => f.question)}
          currentUserId={userId ?? undefined}
          faqs={faqs}
        />
      ) : (
        <ChatToggleButton unreadCount={unreadCount} onClick={toggleChat} />
      )}

      {toastMessage && (
        <div
          onClick={() => setToastMessage(null)}
          className="absolute -top-12 right-0 bg-yellow-300 text-black text-sm px-4 py-2 rounded shadow-lg cursor-pointer animate-fadeIn"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default Chatbox;
