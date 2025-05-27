import React from 'react';
import { FiSend } from 'react-icons/fi';

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
  onFAQClick: (q: string) => void;
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
  return (
    <div className="w-80 h-[460px] bg-[#0D1B2A] text-white border border-yellow-300 rounded-lg flex flex-col shadow-lg overflow-hidden">
      <div className="bg-[#1B263B] flex items-center justify-between p-3 text-sm font-semibold">
        🐮 Hỗ trợ BeefBeef
        <button onClick={onClose} className="text-white hover:text-yellow-300">✕</button>
      </div>

      {!showInput ? (
        <div className="p-3 space-y-2 text-sm">
          <p className="font-semibold text-yellow-300">❓ Câu hỏi thường gặp:</p>
          {faqList.map((faq, idx) => (
            <button
              key={idx}
              onClick={() => onFAQClick(faq)}
              className="block text-left w-full bg-[#1B263B] text-white hover:bg-yellow-300 hover:text-black px-3 py-2 rounded transition"
            >
              {faq}
            </button>
          ))}
          <button
            onClick={onShowInput}
            className="mt-2 text-sm underline hover:text-yellow-300"
          >
            ✏️ Gửi câu hỏi riêng
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[75%] px-3 py-2 rounded-md ${
                  msg.sender === 'user'
                    ? 'ml-auto bg-yellow-300 text-black'
                    : 'mr-auto bg-white text-black'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="border-t border-yellow-300 flex">
            <input
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              className="flex-1 px-3 py-2 bg-[#0D1B2A] text-white outline-none"
              placeholder="Nhập tin nhắn..."
            />
            <button
              onClick={onSend}
              className="px-4 text-yellow-900 bg-yellow-300 hover:bg-yellow-400"
            >
              <FiSend />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWindow;