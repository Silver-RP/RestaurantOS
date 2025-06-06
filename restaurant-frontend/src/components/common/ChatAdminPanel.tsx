import React, { useEffect, useState } from 'react';
import {
  FiSend,
  FiSearch,
  FiImage,
  FiPaperclip,
  FiSmile,
  FiMic,
} from 'react-icons/fi';
import { BsChatDots } from 'react-icons/bs';
import EmojiPicker from 'emoji-picker-react';
import { ReactMic } from 'react-mic';
import { useAdminChatbox } from '@/hooks/useAdminChatbox';

const ChatAdminPanel: React.FC = () => {
  const {
    sessions,
    currentChat,
    messages,
    selectChat,
    handleSend,
    messageEndRef,
  } = useAdminChatbox();
  console.log('ChatAdminPanel sessions:', sessions);
  console.log('ChatAdminPanel currentChat:', currentChat);
  console.log('ChatAdminPanel messages:', messages);
  
  
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [filterUnread, setFilterUnread] = useState<'all' | 'read' | 'unread'>(
    'all',
  );
  const [showEmoji, setShowEmoji] = useState(false);
  const [recording, setRecording] = useState(false);
  const [filteredSessions, setFilteredSessions] = useState(sessions);

  useEffect(() => {
    let filtered = sessions.filter((s) => {
      const username =
        typeof s.user_id === 'string'
          ? s.user_id
          : s.user_id?.username || '';
      return username.toLowerCase().includes(search.toLowerCase());
    });
    if (filterUnread === 'unread') {
      filtered = filtered.filter((s) => (s.unreadCount ?? 0) > 0);
    } else if (filterUnread === 'read') {
      filtered = filtered.filter((s) => (s.unreadCount ?? 0) === 0);
    }
    setFilteredSessions(filtered);
  }, [search, filterUnread, sessions]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSend = () => {
    if (!input.trim() || !currentChat) return;
    handleSend(input);
    setInput('');
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
              const lastMsg = s.lastMessage || 'Chưa có tin nhắn';
              const lastDate = s.lastMessageTime
                ? new Date(s.lastMessageTime).toLocaleTimeString().slice(0, 5)
                : '';

              return (
                <div
                  key={s._id}
                  onClick={() => selectChat(s.user_id._id)}
                  className={`relative flex gap-3 items-center p-2 rounded-lg cursor-pointer transition-all duration-150 ${
                    currentChat?._id === s._id
                      ? 'bg-blue-200'
                      : 'hover:bg-blue-100'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-semibold">
                    {s.user_id.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <div className="truncate text-sm text-blue-900 font-medium">
                        {s.user_id.username}
                      </div>
                      <div className="text-[10px] text-gray-400 ml-2 whitespace-nowrap">
                        {lastDate}
                      </div>
                    </div>
                    <div className="truncate text-xs text-gray-500">
                      {lastMsg}
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
            {currentChat
              ? `Đang trò chuyện với: ${currentChat.user_id.username}`
              : 'Chưa chọn khách hàng'}
          </h4>
        </div>

        {currentChat ? (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 text-sm">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`max-w-[70%] px-4 py-2 rounded-lg shadow-sm whitespace-pre-line ${
                    m.sender === 'admin'
                      ? 'ml-auto bg-blue-200 text-blue-900'
                      : 'mr-auto bg-gray-100 text-gray-900'
                  }`}
                >
                  <div>{m.content}</div>
                  <div className="text-xs text-gray-500 text-right mt-1">
                    {new Date(m.timestamp).toLocaleTimeString().slice(0, 5)}
                  </div>
                </div>
              ))}
              <div ref={messageEndRef}></div>
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
                onClick={onSend}
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
