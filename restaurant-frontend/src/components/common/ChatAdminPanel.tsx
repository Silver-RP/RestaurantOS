// ✅ Admin Chat UI – Refined by Senior Frontend (Blue Themed + Enhanced UX)
// File: components/admin/ChatAdminPanel.tsx

import React, { useEffect, useState, useRef } from 'react';
import {
  FiSend,
  FiSearch,
  FiImage,
  FiPaperclip,
  FiSmile,
  FiMic,
} from 'react-icons/fi';
import { AiOutlineUser } from 'react-icons/ai';
import { BsChatDots } from 'react-icons/bs';
import EmojiPicker from 'emoji-picker-react';
import { ReactMic } from 'react-mic';
import { FaComments } from 'react-icons/fa';

interface Message {
  sender: 'user' | 'admin';
  text: string;
  timestamp: string;
}

interface ChatSession {
  userId: string;
  userName: string;
  avatarUrl?: string;
  messages: Message[];
  unreadCount?: number;
}

const dummySessions: ChatSession[] = [
  {
    userId: 'u1',
    userName: 'Nguyễn Thị Mai',
    messages: [
      {
        sender: 'user',
        text: 'Nhà hàng có món chay không?',
        timestamp: '10:01',
      },
      {
        sender: 'admin',
        text: 'Dạ có ạ, bên em có lẩu nấm và rau củ.',
        timestamp: '10:03',
      },
    ],
    unreadCount: 0,
  },
  {
    userId: 'u2',
    userName: 'Trần Văn An',
    messages: [
      {
        sender: 'user',
        text: 'Tôi muốn đặt bàn 8 người lúc 7h tối.',
        timestamp: '09:50',
      },
    ],
    unreadCount: 1,
  },
];


const ChatAdminPanel: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>(dummySessions);
  const [filteredSessions, setFilteredSessions] = useState(dummySessions);
  const [current, setCurrent] = useState<ChatSession | null>(dummySessions[0]);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [filterUnread, setFilterUnread] = useState<'all' | 'read' | 'unread'>(
    'all',
  );
  const [showEmoji, setShowEmoji] = useState(false);
  const [recording, setRecording] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const unreadTotal = sessions.reduce(
    (sum, s) => sum + (s.unreadCount || 0),
    0,
  );

  useEffect(() => {
    localStorage.setItem('admin-unread-chat-count', unreadTotal.toString());
  }, [unreadTotal]);

  useEffect(() => {
    let filtered = sessions.filter((s) =>
      s.userName.toLowerCase().includes(search.toLowerCase()),
    );
    if (filterUnread === 'unread') {
      filtered = filtered.filter((s) => (s.unreadCount ?? 0) > 0);
    } else if (filterUnread === 'read') {
      filtered = filtered.filter((s) => (s.unreadCount ?? 0) === 0);
    }
    setFilteredSessions(filtered);
  }, [search, filterUnread, sessions]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [current, sessions]);

  const handleSend = () => {
    if (!input.trim() || !current) return;
    const msg: Message = {
      sender: 'admin',
      text: input,
      timestamp: new Date().toLocaleTimeString().slice(0, 5),
    };
    setSessions((prev) =>
      prev.map((s) =>
        s.userId === current.userId
          ? { ...s, messages: [...s.messages, msg], unreadCount: 0 }
          : s,
      ),
    );
    setInput('');
  };

  const handleNewUserMessage = (userId: string, text: string) => {
    const newMessage: Message = {
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString().slice(0, 5),
    };
    setSessions((prev) =>
      prev.map((s) =>
        s.userId === userId
          ? {
              ...s,
              messages: [...s.messages, newMessage],
              unreadCount:
                s.userId === current?.userId ? 0 : (s.unreadCount || 0) + 1,
            }
          : s,
      ),
    );
  };

  return (
    <div className="flex h-[600px] border rounded-xl shadow overflow-hidden bg-white">
      <div className="w-72 border-r p-4 flex flex-col bg-blue-50">
        <div className="flex items-center gap-2 mb-2 border rounded-lg px-3 py-2 bg-white shadow-sm">
          <FiSearch className="text-blue-600" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm khách hàng..."
            className="flex-1 text-sm outline-none bg-transparent text-blue-900"
          />
        </div>
        <select
          value={filterUnread}
          onChange={(e) => setFilterUnread(e.target.value as any)}
          className="mb-4 px-2 py-1 border rounded text-sm text-blue-800 bg-white"
        >
          <option value="all">Tất cả</option>
          <option value="unread">Chưa đọc</option>
          <option value="read">Đã đọc</option>
        </select>
        <div className="overflow-y-auto flex-1 space-y-1 pr-1">
          {filteredSessions.length === 0 ? (
            <div className="text-center text-sm text-blue-400 mt-6">
              Không có phiên trò chuyện nào
            </div>
          ) : (
            filteredSessions.map((s) => {
              const lastMsg = s.messages[s.messages.length - 1];
              const lastDate = lastMsg?.timestamp || '';
              return (
                <div
                  key={s.userId}
                  onClick={() => {
                    setCurrent(s);
                    setSessions((prev) =>
                      prev.map((sess) =>
                        sess.userId === s.userId
                          ? { ...sess, unreadCount: 0 }
                          : sess,
                      ),
                    );
                  }}
                  className={`relative flex gap-3 items-center p-2 rounded-lg cursor-pointer transition-all duration-150 ${
                    current?.userId === s.userId
                      ? 'bg-blue-200'
                      : 'hover:bg-blue-100'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-semibold">
                    {s.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <div className="truncate text-sm text-blue-900 font-medium">
                        {s.userName}
                      </div>
                      <div className="text-[10px] text-gray-400 ml-2 whitespace-nowrap">
                        {lastDate}
                      </div>
                    </div>
                    <div className="truncate text-xs text-gray-500">
                      {lastMsg?.text || 'Chưa có tin nhắn'}
                    </div>
                  </div>
                  {(s.unreadCount ?? 0) > 0 && (
                    <span className="ml-auto text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                      {s.unreadCount}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white relative">
        <div className="flex items-center justify-between bg-white px-5 py-3 border-b">
          <h4 className="font-semibold text-black">
            {current
              ? `Đang trò chuyện với: ${current.userName}`
              : 'Chưa chọn khách hàng'}
          </h4>
        </div>

        {current ? (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 text-sm">
              {current.messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`max-w-[70%] px-4 py-2 rounded-lg shadow-sm whitespace-pre-line ${
                    m.sender === 'admin'
                      ? 'ml-auto bg-blue-200 text-blue-900'
                      : 'mr-auto bg-gray-100 text-gray-900'
                  }`}
                >
                  <div>{m.text}</div>
                  <div className="text-xs text-gray-500 text-right mt-1">
                    {m.timestamp}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef}></div>
            </div>

            {showEmoji && (
              <div className="absolute bottom-20 left-5 z-50">
                <EmojiPicker
                  onEmojiClick={(emojiData) =>
                    setInput((prev) => prev + emojiData.emoji)
                  }
                />
              </div>
            )}

            <div className="border-t px-5 py-3 flex items-center gap-2">
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) console.log('Ảnh được chọn:', file.name);
                }}
              />
              <input
                type="file"
                id="fileUpload"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) console.log('File đính kèm:', file.name);
                }}
              />
              <FiImage
                onClick={() => document.getElementById('imageUpload')?.click()}
                className="text-blue-600 cursor-pointer"
                title="Gửi hình ảnh"
              />
              <FiPaperclip
                onClick={() => document.getElementById('fileUpload')?.click()}
                className="text-blue-600 cursor-pointer"
                title="Đính kèm tập tin"
              />
              <FiSmile
                onClick={() => setShowEmoji(!showEmoji)}
                className="text-blue-600 cursor-pointer"
                title="Gửi emoji"
              />
              <FiMic
                onClick={() => setRecording(!recording)}
                className={`cursor-pointer ${recording ? 'text-red-500' : 'text-blue-600'}`}
                title="Ghi âm"
              />
              <ReactMic
                record={recording}
                onStop={(blob) => console.log('Ghi âm:', blob)}
                mimeType="audio/webm"
                className="hidden"
              />

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border border-blue-300 px-4 py-2 rounded-full outline-none text-blue-900 focus:ring-2 focus:ring-blue-300"
                placeholder="Nhập phản hồi..."
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 transition rounded-full text-white"
              >
                <FiSend />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-blue-500">
            <BsChatDots size={64} className="mb-4 text-blue-400" />
            <p className="text-lg font-semibold">Chưa chọn khách hàng nào</p>
            <p className="text-sm">
              Hãy chọn một phiên trò chuyện từ danh sách bên trái
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatAdminPanel;
