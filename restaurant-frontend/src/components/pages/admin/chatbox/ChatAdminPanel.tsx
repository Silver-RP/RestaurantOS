import React, { useEffect, useRef, useState } from 'react';
import {
  FiSend,
  FiSearch,
  FiImage,
  FiPaperclip,
  FiSmile,
  FiMic,
  FiCornerDownLeft,
  FiChevronDown,
  FiMoreVertical,
} from 'react-icons/fi';
import { BsChatDots } from 'react-icons/bs';
import { ReactMic } from 'react-mic';
import { useAdminChatbox } from '@/hooks/useAdminChatbox';
import { EmojiButton } from '@joeattardi/emoji-button';
import { socket } from '@/utils/socket';
import { ChatMessage } from '@/types/Chatbox.type';

type User = {
  _id: string;
  username: string;
  isOnline?: boolean;
};

type ChatSession = {
  _id: string;
  user_id: User;
  unreadCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
  cashier_user_id?: string;
};
const ChatAdminPanel: React.FC = () => {
  const {
    sessions,
    currentChat,
    messages,
    selectChat,
    handleSend,
    messageEndRef,
  } = useAdminChatbox();
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [filterUnread, setFilterUnread] = useState<'all' | 'read' | 'unread'>('all');
  const [recording, setRecording] = useState(false);
  const [filteredSessions, setFilteredSessions] = useState(sessions);
  const [reactionPicker, setReactionPicker] = useState<number | null>(null);
  const [messageReactions, setMessageReactions] = useState<{ [key: number]: string }>({});
  const emojiButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let filtered = sessions.filter((s) => {
      const username = typeof s.user_id === 'string' ? s.user_id : s.user_id?.username || '';
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
    setReplyingTo(null); 
  };

  const handleReaction = (emoji: string, idx: number) => {
    setMessageReactions((prev) => ({ ...prev, [idx]: emoji }));
    handleReactionSaveToServer(messages[idx]._id, emoji);
  };

  const handleReactionSaveToServer = async (messageId: string, emoji: string) => {
    try {
      console.log('Sending to server:', { messageId, emoji });
      socket.emit('reactMessage', {
        messageId,
        emoji,
        userId: currentChat?.cashier_user_id,
        chatId: currentChat?._id,
      });
    } catch (error) {
      console.error('Error saving reaction:', error);
    }
  };

  const handleReply = (msg: ChatMessage) => {
    setReplyingTo(msg);
  };


  const showReactionPicker = (idx: number) => {
    const picker = new EmojiButton({ position: 'bottom-end', theme: 'light' });
    picker.on('emoji', (selection) => {
      handleReaction(selection.emoji, idx);
    });
    if (emojiButtonRefs.current[idx]) picker.togglePicker(emojiButtonRefs.current[idx]!);
  };

  return (
    <div className="flex h-[600px] border border-gray-200 rounded-xl shadow overflow-hidden bg-[#f7f9fc]">
      <div className="w-72 border-r p-4 flex flex-col bg-white">
        <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-white border border-gray-300 focus-within:ring-2 focus-within:ring-blue-400 shadow-sm transition-all">
          <FiSearch className="text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm..."
            className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>
        <div className="relative w-full mb-4">
          <select
            value={filterUnread}
            onChange={(e) => setFilterUnread(e.target.value as any)}
            className="w-full appearance-none px-3 py-2 pr-10 border border-gray-300 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="all">Tất cả</option>
            <option value="unread">Đã đọc</option>
            <option value="read">Chưa đọc</option>
          </select>
          <div className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none text-gray-500">
            <FiChevronDown />
          </div>
        </div>
        <div className="overflow-y-auto flex-1 space-y-1 pr-1">
          {filteredSessions.length === 0 ? (
            <div className="text-center text-sm text-gray-400 mt-6">No chats available</div>
          ) : (
            filteredSessions.map((s) => {
              const lastMsg = s.lastMessage || 'Không có tin nhắn nào';
              const lastDate = s.lastMessageTime
                ? new Date(s.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '';

              return (
                <div
                  key={s._id}
                  onClick={() => selectChat(s.user_id._id)}
                  className={`relative flex gap-3 items-center p-2 rounded-lg cursor-pointer transition-all duration-150 ${currentChat?._id === s._id ? 'bg-[#dce9fa]' : 'hover:bg-[#f0f3f7]'
                    }`}
                >
                  {/* Avatar + Status Dot */}
                  <div className="relative w-10 h-10">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-semibold">
                      {s.user_id.username.charAt(0).toUpperCase()}
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${s.user_id.isOnline ? 'bg-green-400' : 'bg-red-500'
                        }`}
                    />
                  </div>

                  {/* Nội dung chat */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <div className="truncate text-sm text-gray-800 font-medium">
                        {s.user_id.username}
                      </div>
                      <div className="text-[10px] text-gray-400 ml-2 whitespace-nowrap">
                        {lastDate}
                      </div>
                    </div>
                    <div className="truncate text-xs text-gray-500">{lastMsg}</div>
                  </div>

                  {/* Badge unread */}
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
        <div className="flex items-center justify-between bg-white px-5 py-3 border-b relative">
          <h4 className="font-semibold text-gray-800">
            {currentChat ? `Trò chuyện cùng: ${currentChat.user_id.username}` : 'Chọn một phiên trò chuyện'}
          </h4>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-500 hover:text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h.01M12 12h.01M18 12h.01" />
            </svg>
          </button>

          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute right-5 top-12 w-48 bg-white border rounded-md shadow-md z-50"
            >
              <button
                onClick={() => {
                  console.log('Delete chat');
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-[12px] text-red-600 "
              >
                🗑️ Xóa trò chuyện
              </button>
              <button
                onClick={() => {
                  console.log('Block user');
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-[12px] text-gray-700"
              >
                🚫 Chặn người dùng
              </button>
            </div>
          )}
        </div>
        {currentChat ? (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 text-sm">
              <div className="flex flex-col gap-y-2">
                {messages.map((m, idx) => {
                  const isMine = m.sender_id === currentChat?.cashier_user_id;
                  const emoji = messageReactions[idx];
                  return (
                    <div className="flex items-end gap-2" key={idx}>
                      {!isMine && (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-bold">
                          {(currentChat?.user_id.username || 'U')?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div
                        className={`relative group inline-block px-4 py-2 rounded-2xl shadow-md whitespace-pre-wrap break-words max-w-[80%] ${isMine
                          ? 'ml-auto bg-[#3B82F6] text-white hover:bg-[#2563EB]'
                          : 'mr-auto bg-gray-100 text-gray-900'
                          }`}
                      >
                        {m.reply_to && typeof m.reply_to === 'object' && (
                          <div className={`mb-1 p-2 rounded bg-white border-l-4 ${isMine ? 'border-blue-300' : 'border-gray-300'} text-sm`}>
                            <div className="font-semibold text-gray-800 text-xs">
                              {m.reply_to.sender_id === currentChat?.cashier_user_id ? 'Bạn' : currentChat?.user_id.username}
                            </div>
                            <div className="text-gray-600 text-sm truncate">{m.reply_to.content}</div>
                          </div>
                        )}
                        <div>{m.content}</div>
                        <div className="mt-1 flex justify-end">
                          <span className={`text-xs ${isMine ? 'text-white/70' : 'text-gray-500'}`}>
                            {new Date(m.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {emoji && (
                          <div className="absolute bottom-[-12px] right-[-6px] text-xl">{emoji}</div>
                        )}

                        <div
                          className={`absolute top-1/2 -translate-y-1/2 z-20 hidden group-hover:flex gap-1 ${isMine
                            ? 'right-full translate-x-[-8px]'
                            : 'left-full translate-x-[8px]'
                            }`}
                        >
                          {isMine ? (
                            <>
                              {/* 1. Dấu 3 chấm */}
                              <button className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:scale-110 transition">
                                <FiMoreVertical className="text-gray-800" />
                              </button>

                              {/* 2. Emoji */}
                              <button
                                ref={(el) => (emojiButtonRefs.current[idx] = el)}
                                onClick={() => showReactionPicker(idx)}
                                className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:scale-110 transition"
                              >
                                😊
                              </button>

                              {/* 3. Reply */}
                              <button
                                onClick={() => handleReply(m)}
                                className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:scale-110 transition"
                              >
                                <FiCornerDownLeft className="text-gray-800" />
                              </button>
                            </>
                          ) : (
                            <>
                              {/* 1. Reply */}
                              <button
                                onClick={() => handleReply(m)}
                                className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:scale-110 transition"
                              >
                                <FiCornerDownLeft className="text-gray-800" />
                              </button>

                              {/* 2. Emoji */}
                              <button
                                ref={(el) => (emojiButtonRefs.current[idx] = el)}
                                onClick={() => showReactionPicker(idx)}
                                className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:scale-110 transition"
                              >
                                😊
                              </button>

                              {/* 3. Dấu 3 chấm */}
                              <button className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:scale-110 transition">
                                <FiMoreVertical className="text-gray-800" />
                              </button>
                            </>
                          )}
                        </div>


                      </div>
                    </div>


                  );
                })}

                <div ref={messageEndRef}></div>
              </div>
            </div>
            {replyingTo && (
              <div className="px-5 py-2 border-t bg-gray-50">
                <div className="px-4 py-2 rounded-lg bg-gray-100 border-l-4 border-blue-400 text-sm relative">
                  <div className="text-gray-600 mb-1">
                    Đang trả lời: <span className="font-medium text-blue-600">
                      {replyingTo.sender_role === 'cashier' ? 'Bạn' : currentChat?.user_id.username}
                    </span>
                  </div>
                  <div className="text-gray-800 italic truncate max-w-[90%]">
                    {replyingTo.content}
                  </div>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="absolute top-1 right-2 text-gray-500 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
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
                  if (file) console.log('Selected image:', file.name);
                }}
              />
              <input
                type="file"
                id="fileUpload"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) console.log('Attached file:', file.name);
                }}
              />
              <FiImage
                onClick={() => document.getElementById('imageUpload')?.click()}
                className="text-gray-500 cursor-pointer"
                title="Send Image"
              />
              <FiPaperclip
                onClick={() => document.getElementById('fileUpload')?.click()}
                className="text-gray-500 cursor-pointer"
                title="Attach File"
              />
              <FiSmile
                onClick={() => setInput((prev) => prev + '😊')}
                className="text-gray-500 cursor-pointer"
                title="Emoji"
              />
              <FiMic
                onClick={() => setRecording(!recording)}
                className={`cursor-pointer ${recording ? 'text-red-500' : 'text-gray-500'}`}
                title="Record"
              />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border border-gray-300 px-4 py-2 rounded-full outline-none text-gray-800 focus:ring-2 focus:ring-blue-300"
                placeholder="Nhập tin nhắn..."
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
          <div className="flex-1 flex flex-col items-center justify-center text-blue-400">
            <BsChatDots size={64} className="mb-4" />
            <p className="text-lg font-semibold">Bạn hiện chưa có tin nhắn nào.</p>
            <p className="text-sm">Vui lòng chọn một phiên bên trái</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatAdminPanel;