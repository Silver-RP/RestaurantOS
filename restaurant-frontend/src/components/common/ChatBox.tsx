import React, { useEffect, useRef, useState } from 'react';
import ChatToggleButton from './ChatToggleButton';
import ChatWindow from './ChatWindow';
import { useFaq } from '@/hooks/useFaq';
import { getAnswerByQuestion } from '@/api/FaqApi';
import { useChatbox } from '@/hooks/useChatbox';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const Chatbox: React.FC = () => {
  const {
    messages: realMessages,
    handleSend: sendRealMessage,
    chatId,
    typingUserId,
    loading,
  } = useChatbox();
  const { faqs } = useFaq();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(3);
  const [input, setInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleShowInput = () => setShowInput((prev) => !prev);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowInput(false);
  };

  const handleFAQClick = async (question: string) => {
    if (!showInput) setShowInput(true);
    setMessages((prev) => [...prev, { sender: 'user', text: question }]);
    scrollToBottom();
    const matched = await getAnswerByQuestion(question);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: matched?.answer || 'Xin lỗi, tôi chưa có câu trả lời phù hợp.',
        },
      ]);
      scrollToBottom();
    }, 500);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    if (showInput && chatId) {
      await sendRealMessage(input);
      setInput('');
    } else {
      setMessages((prev) => [...prev, { sender: 'user', text: input }]);
      setInput('');
      const matched = await getAnswerByQuestion(input);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: matched?.answer || 'Xin lỗi, tôi chưa có câu trả lời phù hợp.',
        },
      ]);
    }
  };

  useEffect(() => {
    if (isOpen) setUnreadCount(0);
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <ChatWindow
          messages={[...messages, ...realMessages]}
          input={input}
          onInputChange={setInput}
          onSend={handleSend}
          onClose={toggleChat}
          showInput={showInput}
          onShowInput={toggleShowInput}
          onFAQClick={handleFAQClick}
          faqList={faqs.map((f) => f.question)}
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
