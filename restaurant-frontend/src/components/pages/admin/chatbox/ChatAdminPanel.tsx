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
// import { ReactMic } from 'react-mic';
import { useAdminChatbox } from '@/hooks/useAdminChatbox';
import { socket } from '@/utils/socket';
import { ChatMessage, ChatSessionResponse } from '@/types/Chatbox.type';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

const getUserObj = (u: unknown): { _id?: string; username?: string; isOnline?: boolean } | null => {
  return typeof u === 'object' && u !== null ? (u as { _id?: string; username?: string; isOnline?: boolean }) : null;
};
const getUserName = (u: unknown): string => getUserObj(u)?.username ?? `User ${String(u ?? '').slice(-4)}`;
const getUserOnline = (u: unknown): boolean => Boolean(getUserObj(u)?.isOnline);


const ChatAdminPanel: React.FC = () => {
  const {
    sessions,
    currentChat,
    messages,
    selectChat,
    handleSend,
    messageEndRef,
    setMessages,
  } = useAdminChatbox();


  const [images, setImages] = useState<string[]>([]);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [filterUnread, setFilterUnread] = useState<'all' | 'read' | 'unread'>('all');
  const [filteredSessions, setFilteredSessions] = useState<ChatSessionResponse[]>(sessions as ChatSessionResponse[]);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [reactionPopupIdx, setReactionPopupIdx] = useState<number | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
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
    const handleClickOutsideEmoji = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideEmoji);
    return () => document.removeEventListener('mousedown', handleClickOutsideEmoji);
  }, []);

  useEffect(() => {
    let filtered = (sessions as ChatSessionResponse[]).filter((s) => getUserName(s.user_id).toLowerCase().includes(search.toLowerCase()));
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
    if ((!input.trim() && images.length === 0) || !currentChat) return;


    // Gửi tin nhắn lên server, truyền thêm images
    handleSend(input, replyingTo?._id, images);
    setInput('');
    setReplyingTo(null);
    setImages([]);
  };

  // Gửi tin nhắn khi nhấn Enter
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSend();
    }
  };

  const handleReaction = (emoji: string, idx: number) => {
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

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex h-[640px] border border-gray-200 rounded-2xl shadow-lg overflow-hidden bg-[#f7f9fc]">
      <div className="w-80 border-r p-4 flex flex-col bg-white">
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
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterUnread(e.target.value as 'all' | 'read' | 'unread')}
            className="w-full appearance-none px-3 py-2 pr-10 border border-gray-300 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="all">Tất cả</option>
            <option value="unread">Chưa đọc</option>
            <option value="read">Đã đọc</option>
          </select>
          <div className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none text-gray-500">
            <FiChevronDown />
          </div>
        </div>
        <div className="overflow-y-auto flex-1 space-y-1 pr-1">
          {filteredSessions.length === 0 ? (
            <div className="text-center text-sm text-gray-400 mt-6">No chats available</div>
          ) : (
            filteredSessions
              .filter((s) => s.user_id)
              .map((s: ChatSessionResponse) => {
                const lastMsg: string = s.lastMessage
                  ? (typeof s.lastMessage === 'string' ? s.lastMessage : (s.lastMessage as ChatMessage).content)
                  : 'Không có tin nhắn nào';
                const lastDate = s.lastMessageTime
                  ? new Date(s.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '';

                return (
                  <div
                    key={s._id}
                    onClick={() => selectChat(typeof s.user_id === 'string' ? s.user_id : String((getUserObj(s.user_id)?._id) || ''))}
                    className={`relative flex gap-3 items-center p-2 rounded-lg cursor-pointer transition-all duration-150 ${currentChat?._id === s._id ? 'bg-[#dce9fa]' : 'hover:bg-[#f0f3f7]'
                      }`}
                  >
                    {/* Avatar + Status Dot */}
                    <div className="relative w-10 h-10">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-semibold">
                        {getUserName(s.user_id).charAt(0).toUpperCase()}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getUserOnline(s.user_id) ? 'bg-green-400' : 'bg-red-500'
                          }`}
                      />
                    </div>

                    {/* Nội dung chat */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <div className="truncate text-sm text-gray-800 font-medium">{getUserName(s.user_id)}</div>
                        <div className="text-[10px] text-gray-400 ml-2 whitespace-nowrap">{lastDate}</div>
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
        <div className="flex items-center justify-between bg-white/90 backdrop-blur px-5 py-3 border-b relative">
          <h4 className="font-semibold text-gray-800">
            {currentChat ? `Trò chuyện cùng: ${getUserName(currentChat.user_id)}` : 'Chọn một phiên trò chuyện'}
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
                  // treat message as "mine" (right side) when it's from the cashier
                  const isMine =
                    m.sender_role === 'cashier' ||
                    m.sender_role === 'bot' ||
                    m.sender_id === currentChat?.cashier_user_id;
                  return (
                    <div className="flex items-end gap-2" key={idx}
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx((prev) => (prev === idx ? null : prev))}
                    >
                      {!isMine && currentChat && (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-bold">
                          {getUserName(currentChat.user_id).charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div
                        className={`relative group inline-block ${isMine ? 'px-4 py-2' : 'px-3 py-2'} rounded-2xl shadow-md whitespace-pre-wrap break-words max-w-[50%] ${isMine
                          ? ' max-w-[50%] ml-auto mb-2 bg-[#3B82F6] text-white hover:bg-[#2563EB]'
                          : 'mr-auto mb-2 bg-gray-100 text-gray-900'
                          }`}
                      >
                        {m.reply_to && typeof m.reply_to === 'object' && (
                          <div
                            className={`mb-1 p-2 rounded bg-white border-l-4 ${isMine ? 'border-blue-300' : 'border-gray-300'} text-sm max-w-[220px]`}
                            style={{ wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis' }}
                          >
                            <div className="font-semibold text-gray-800 text-xs truncate">
                              {(() => {
                                if (m.reply_to.sender_role === 'bot') return 'Bot';
                                if (m.reply_to.sender_role === 'cashier') return getUserName(currentChat?.cashier_user_id);
                                if (m.reply_to.sender_role === 'user') return getUserName(currentChat?.user_id);
                                return getUserName(m.reply_to.sender_id);
                              })()}
                            </div>
                            <div className="text-gray-600 text-sm truncate max-w-[200px]">
                              {m.reply_to.content.length > 50
                                ? m.reply_to.content.slice(0, 50) + '...'
                                : m.reply_to.content}
                            </div>
                          </div>
                        )}
                        {/* Hiển thị ảnh nếu là tin nhắn ảnh */}
                        {m.message_type === 'image' && (Array.isArray(m.image) ? m.image.length > 0 : false) && (
                          <div className="mt-2 space-y-2">
                            {(m.image || []).map((imgUrl: string, imgIdx: number) => (
                              <img
                                key={imgIdx}
                                src={imgUrl}
                                alt={`Hình ảnh ${imgIdx + 1}`}
                                className="w-[120px] h-auto rounded-xl border border-gray-300 cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => window.open(imgUrl, '_blank')}
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            ))}
                          </div>
                        )}
                        {/* Nếu không phải ảnh thì hiển thị content như cũ */}
                        {m.message_type !== 'image' && <div>{m.content}</div>}
                        <div className="mt-1 flex justify-end">
                          <span className={`text-xs ${isMine ? 'text-white/70' : 'text-gray-500'}`}>
                            {new Date(m.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Reactions summary (gom nhóm) */}
                        {m.reactions && m.reactions.length > 0 && (
                          <div className={`absolute bottom-[-14px] ${isMine ? 'right-[-6px]' : 'left-[-6px]'} bg-white rounded-full border border-gray-200 shadow px-1.5 py-[2px] text-[12px] flex items-center gap-1`}
                          >
                            {[...new Map((m.reactions ?? []).map((r: { emoji: string }) => [r.emoji, true])).keys()].slice(0, 5).map((emoji, i) => (
                              <span key={i}>{emoji}</span>
                            ))}
                            <span className="text-gray-500">{(m.reactions ?? []).length}</span>
                          </div>
                        )}

                        <div
                          className={`absolute top-1/2 -translate-y-1/2 z-20 ${hoveredIdx === idx ? 'flex' : 'hidden group-hover:flex'} gap-1 ${isMine
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
                                onClick={() => setReactionPopupIdx(idx)}
                                className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:scale-110 transition"
                              >
                                😊
                              </button>

                              {/* Popup reaction */}
                              {reactionPopupIdx === idx && (
                                <div className="absolute top-[-48px] left-1/2 -translate-x-1/2 flex gap-2 bg-white border rounded-lg shadow px-2 py-1 z-50">
                                  <button
                                    onClick={() => { handleReaction('❤️', idx); setReactionPopupIdx(null); }}
                                    className="text-xl hover:scale-125 transition"
                                    title="Thả tim"
                                  >❤️</button>
                                  <button
                                    onClick={() => { handleReaction('👍', idx); setReactionPopupIdx(null); }}
                                    className="text-xl hover:scale-125 transition"
                                    title="Like"
                                  >👍</button>
                                </div>
                              )}

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
                                onClick={() => setReactionPopupIdx(idx)}
                                className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:scale-110 transition"
                              >
                                😊
                              </button>

                              {/* Popup reaction */}
                              {reactionPopupIdx === idx && (
                                <div className="absolute top-[-48px] left-1/2 -translate-x-1/2 flex gap-2 bg-white border rounded-lg shadow px-2 py-1 z-50">
                                  <button
                                    onClick={() => { handleReaction('❤️', idx); setReactionPopupIdx(null); }}
                                    className="text-xl hover:scale-125 transition"
                                    title="Thả tim"
                                  >❤️</button>
                                  <button
                                    onClick={() => { handleReaction('👍', idx); setReactionPopupIdx(null); }}
                                    className="text-xl hover:scale-125 transition"
                                    title="Like"
                                  >👍</button>
                                </div>
                              )}

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
                <div className="px-4 py-2 rounded-lg bg-gray-100 border-l-4 border-blue-400 text-sm relative max-w-xs">
                  <div className="text-gray-600 mb-1">
                    Đang trả lời: <span className="font-medium text-blue-600">
                      {replyingTo.sender_role === 'cashier' ? 'Bạn' : getUserName(currentChat?.user_id as unknown)}
                    </span>
                  </div>
                  <div className="text-gray-800 italic truncate max-w-[180px]">
                    {replyingTo.content.length > 50
                      ? replyingTo.content.slice(0, 50) + '...'
                      : replyingTo.content}
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

            <div className="border-t px-5 py-3 flex items-center gap-2 bg-white/90 backdrop-blur">
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    Array.from(files).forEach(file => {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        if (ev.target?.result) {
                          setImages(prev => [...prev, ev.target!.result as string]);
                        }
                      };
                      reader.readAsDataURL(file);
                    });
                  }
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
              <div className="relative">
                <FiSmile
                  onClick={() => setShowEmojiPicker(prev => !prev)}
                  className="text-gray-500 cursor-pointer"
                  title="Emoji"
                />
                {showEmojiPicker && (
                  <div ref={emojiPickerRef} className="absolute bottom-12 left-0 z-50">
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                )}
              </div>
              <FiImage
                onClick={() => document.getElementById('imageUpload')?.click()}
                className="text-gray-500 cursor-pointer"
                title="Gửi ảnh"
              />

              {/* <FiMic
                onClick={() => setRecording(!recording)}
                className={`cursor-pointer ${recording ? 'text-red-500' : 'text-gray-500'}`}
                title="Record"
              /> */}
              {/* Hiển thị ảnh đã chọn trước khi gửi */}
              {images.length > 0 && (
                <div className="flex gap-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={img} alt={`Ảnh ${idx + 1}`} className="w-12 h-12 object-cover rounded" />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-white rounded-full text-xs px-1 text-red-500"
                        onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
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