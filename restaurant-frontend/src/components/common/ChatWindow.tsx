// ✅ ChatWindow.tsx – Giao diện khung chat UI lớn, tối ưu input + icon + scroll-to-bottom fix
import React, { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}
interface ChatWindowProps {
  messages: Message[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onClose: () => void;
  showInput: boolean;
  onShowInput: () => void;
  onFAQClick: (question: string) => void;
}

const faqList = [
  'Nhà hàng mở cửa lúc mấy giờ?',
  'Có món chay không?',
  'Tôi cần đặt bàn cho 10 người?',
  'Hình thức thanh toán nào được chấp nhận?',
];

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  input,
  onInputChange,
  onSend,
  onClose,
  showInput,
  onShowInput,
  onFAQClick,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages]);

  const handleSendClick = () => {
    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onInputChange('');
        onSend();
      };
      reader.readAsDataURL(selectedImage);
      setSelectedImage(null);
    } else {
      onSend();
    }
  };

  return (
    <div className="w-[420px] h-[620px] bg-[#0D1B2A] text-white border border-yellow-300 rounded-lg flex flex-col shadow-lg overflow-hidden relative">
      <div className="bg-[#1B263B] flex items-center justify-between p-4 text-base font-semibold">
        🐮 Hỗ trợ BeefBeef
        <button onClick={onClose} className="text-white hover:text-yellow-300 text-xl">
          ✕
        </button>
      </div>

      {!showInput ? (
        <div className="p-4 space-y-3 text-sm">
          <p className="font-semibold text-yellow-300">
            ❓ Câu hỏi thường gặp:
          </p>
          {faqList.map((faq, idx) => (
            <button
              key={idx}
              onClick={() => onFAQClick(faq)}
              className="block text-left w-full bg-[#1B263B] text-white hover:bg-yellow-300 hover:text-black px-4 py-3 rounded transition"
            >
              {faq}
            </button>
          ))}
          <button
            onClick={onShowInput}
            className="mt-4 text-sm underline hover:text-yellow-300"
          >
            ✏️ Gửi câu hỏi riêng
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-transparent scrollbar-thumb-rounded-full hover:scrollbar-thumb-yellow-500">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <img
                    src="/bot-avatar.png"
                    className="w-7 h-7 rounded-full mr-3"
                  />
                )}
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-yellow-300 text-black' : 'bg-white text-black'}`}
                >
                  <p>{msg.text}</p>
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>
                {msg.sender === 'user' && (
                  <img
                    src="/user-avatar.png"
                    className="w-7 h-7 rounded-full ml-3"
                  />
                )}
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>

          <div className="border-t border-yellow-300 p-2 bg-[#0D1B2A] flex items-center gap-2 relative">
            <div className="flex items-center gap-1">
              <button
                className="text-white hover:text-yellow-300 text-lg"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                😊
              </button>
              <label className="cursor-pointer text-white hover:text-yellow-300 text-lg">
                📷
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setSelectedImage(file);
                  }}
                />
              </label>
              <button
                onClick={() => alert('🚧 Tính năng ghi âm sẽ sớm ra mắt')}
                className="text-white hover:text-yellow-300 text-lg"
              >
                🎤
              </button>
              <button
                onClick={() => alert('🔗 Gửi link sẽ sớm được hỗ trợ')}
                className="text-white hover:text-yellow-300 text-lg"
              >
                🔗
              </button>
            </div>
            <input
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              className="flex-1 px-3 py-[6px] bg-[#0D1B2A] text-white text-sm outline-none border border-white/10 rounded min-w-0"
              placeholder="Nhập tin nhắn, emoji, đính kèm..."
            />
            <button
              onClick={handleSendClick}
              className="shrink-0 w-10 h-10 bg-yellow-300 text-black rounded flex items-center justify-center hover:bg-yellow-400 shadow"
            >
              <FiSend size={18} />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-14 left-0 z-50">
                <EmojiPicker
                  theme="dark"
                  onEmojiClick={(e) => onInputChange(input + e.emoji)}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWindow;