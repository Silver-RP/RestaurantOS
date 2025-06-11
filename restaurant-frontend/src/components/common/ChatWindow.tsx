import React, { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import EmojiPicker, { Theme } from 'emoji-picker-react';

type UnifiedMessage = {
  sender?: 'user' | 'bot';
  text?: string;
  sender_role?: string;
  content?: string;
};

interface ChatWindowProps {
  messages: UnifiedMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onClose: () => void;
  showInput: boolean;
  onShowInput: () => void;
  onFAQClick: (question: string) => void;
  faqList: string[];
  currentUserId?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  input,
  onInputChange,
  onSend,
  onClose,
  showInput,
  onShowInput,
  onFAQClick,
  faqList,
  currentUserId,
}) => {
  console.log('[DEBUG] currentUserId:', currentUserId); // 👈 dòng này để kiểm tra
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      {/* Header */}
      <div className="bg-[#1B263B] flex items-center justify-between px-4 py-3 text-base font-semibold">
        <span className="text-white">🐮 Hỗ trợ BeefBeef</span>
        <div className="flex items-center gap-3">
          {showInput && (
            <button
              onClick={onShowInput}
              title="Quay lại câu hỏi"
              className="text-yellow-300 text-lg hover:text-white transition"
            >
              🔙
            </button>
          )}
          <button
            onClick={onClose}
            className="text-white hover:text-yellow-300 text-xl"
            title="Đóng"
          >
            ✕
          </button>
        </div>
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
          {/* Message display */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-transparent scrollbar-thumb-rounded-full hover:scrollbar-thumb-yellow-500">
            {messages.map((msg, idx) => {
              const senderId = msg.sender || '';
              const text = msg.text || msg.content || '';
              const isMine = senderId === currentUserId;

              console.log(`[DEBUG] msg[${idx}]:`, {
                senderId,
                currentUserId,
                isMine,
                text,
              });
              return (
                <div
                  key={idx}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMine && (
                    <img
                      src="/bot-avatar.png"
                      className="w-7 h-7 rounded-full mr-3"
                    />
                  )}
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-lg ${isMine ? 'bg-yellow-300 text-black' : 'bg-white text-black'}`}
                  >
                    <p>{text}</p>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                  {isMine && (
                    <img
                      src="/user-avatar.png"
                      className="w-7 h-7 rounded-full ml-3"
                    />
                  )}
                </div>
              );
            })}

            <div ref={messageEndRef} />
          </div>

          {/* Input */}
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
                  theme={Theme.DARK}
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
