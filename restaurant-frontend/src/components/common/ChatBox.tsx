// ✅ Chatbox.tsx – Thêm hiệu ứng bot gõ và trả lời tự động
import React, { useEffect, useState } from 'react';
import ChatToggleButton from './ChatToggleButton';
import ChatWindow from './ChatWindow';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const Chatbox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(3);
  const [input, setInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowInput(false);
  };

  const handleFAQClick = (question: string) => {
    if (question === 'typing-response') {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Đang soạn trả lời...' },
      ]);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { sender: 'bot', text: 'Đây là thông tin bạn cần...' },
        ]);
      }, 1000);
      return;
    }

    // Hiển thị phần nhập tin nhắn nếu chưa bật
    if (!showInput) setShowInput(true);

    // Gửi câu hỏi từ FAQ lên UI
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: question },
    ]);

    // Bot trả lời sau một chút delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Đây là thông tin bạn cần...' },
      ]);
    }, 500);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    setInput('');
  };

  useEffect(() => {
    if (isOpen) setUnreadCount(0);
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <ChatWindow
          messages={messages}
          input={input}
          onInputChange={setInput}
          onSend={handleSend}
          onClose={toggleChat}
          showInput={showInput}
          onShowInput={() => setShowInput(true)}
          onFAQClick={handleFAQClick}
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
