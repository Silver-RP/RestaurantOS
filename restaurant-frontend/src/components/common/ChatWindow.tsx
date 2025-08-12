/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { FiCornerDownLeft, FiMoreVertical, FiSend } from 'react-icons/fi';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { socket } from '@/utils/socket';
import { EmojiButton } from '@joeattardi/emoji-button';

type UnifiedMessage = {
  sender_id?: 'user' | 'bot' | string;
  text?: string;
  sender_role?: string;
  content?: string;
  sent_at?: string | number;
  reactions?: { emoji: string; userId?: string }[];
  message_type?: 'text' | 'image' | 'file';
  attachments?: string[];
  _id?: string;
  reply_to?: { _id?: string; content?: string; sender_id?: string } | null;
};

interface ChatWindowProps {
  messages: UnifiedMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: (replyToId?: string, attachments?: string[]) => void;
  onClose: () => void;
  showInput: boolean;
  onShowInput: () => void;
  onFAQClick: (question: string) => void;
  faqList: string[];
  currentUserId?: string;
  chatId?: string;
  faqs: { question: string; answer: string }[];
    onInputKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;

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
  chatId,
  faqs,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [reactionPickerIdx, setReactionPickerIdx] = useState<number | null>(null);
  const [reactionPickerLock, setReactionPickerLock] = useState(false);
  const [reactionFullPickerIdx, setReactionFullPickerIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const hideActionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const actionHideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reactionPickerRef = useRef<HTMLDivElement | null>(null);
  const popularEmojis = ['❤️', '😆', '😮', '😢', '😡', '👍'];
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const emojiButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pickerRef = useRef<EmojiButton | null>(null);
  const currentMsgIdRef = useRef<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [loadingFaq, setLoadingFaq] = useState<number | null>(null);
  const [typingText, setTypingText] = useState<string>('');
  const typingInterval = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [faqAnswers, setFaqAnswers] = useState<{ [key: number]: string }>({});
  const [replyTarget, setReplyTarget] = useState<{ id: string; preview: string } | null>(null);
  
  const aggregateReactions = (reactions?: { emoji: string; userId?: string }[]) => {
    if (!reactions || reactions.length === 0) return { items: [] as { emoji: string; count: number }[], total: 0 };
    const counts = new Map<string, number>();
    reactions.forEach((r) => counts.set(r.emoji, (counts.get(r.emoji) || 0) + 1));
    const order = ['❤️', '😆', '😮', '😢', '😡', '👍'];
    const items = Array.from(counts.entries())
      .map(([emoji, count]) => ({ emoji, count }))
      .sort((a, b) => order.indexOf(a.emoji) - order.indexOf(b.emoji));
    const total = reactions.length;
    return { items, total };
  };
  
  const formatTime = (value?: string | number) => {
    try {
      if (!value) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const d = typeof value === 'number' ? new Date(value) : new Date(value);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  useEffect(() => {
    // Đóng dải emoji khi click ra ngoài
    function handleClickOutside(event: MouseEvent) {
      if (
        reactionPickerRef.current &&
        !reactionPickerRef.current.contains(event.target as Node)
      ) {
        setReactionPickerLock(false);
        setReactionPickerIdx(null);
      }
    }
    if (reactionPickerLock) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (hideActionTimeout.current) clearTimeout(hideActionTimeout.current);
    };
  }, [reactionPickerLock]);

  // Tự cuộn xuống khi có tin nhắn mới hoặc đổi chế độ
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showInput]);

  const handleSendClick = () => {
    if (selectedImage) {
      const imageToSend = selectedImage;
      setSelectedImage(null); // Reset trước khi đọc để tránh trùng
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        onInputChange('');
        onSend(replyTarget?.id, [dataUrl]);
        setReplyTarget(null);
      };
      reader.readAsDataURL(imageToSend);
    } else {
      onSend(replyTarget?.id);
      setReplyTarget(null);
    }
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    if (!currentUserId) return;
    socket.emit('reactMessage', {
      messageId,
      emoji,
      userId: currentUserId,
      chatId,
    });
  };
  const showReactionPicker = (idx: number, messageId: string) => {
    if (reactionPickerIdx === idx && reactionPickerLock) {
      // Nếu đang mở, click lại sẽ đóng
      setReactionPickerLock(false);
      setReactionPickerIdx(null);
    } else {
      setReactionPickerIdx(idx);
      setReactionPickerLock(true);
      currentMsgIdRef.current = messageId;
    }
  };

  const handleFaqClick = (idx: number) => {
    setExpandedFaq(null);
    setLoadingFaq(idx);
    setTypingText('');
    if (typingInterval.current) clearInterval(typingInterval.current);
    setTimeout(() => {
      setExpandedFaq(idx);
      setLoadingFaq(null);
    }, 400); // 400ms loading effect
  };

  useEffect(() => {
    if (expandedFaq !== null && !loadingFaq) {
      const matched = faqs.find(
        (f) =>
          f.question.trim().toLowerCase() ===
          faqList[expandedFaq].trim().toLowerCase(),
      );
      const answer =
        matched?.answer || 'Xin lỗi, tôi chưa có câu trả lời phù hợp.';
      let i = 0;
      setTypingText('');
      if (typingInterval.current) clearInterval(typingInterval.current);
      typingInterval.current = setInterval(() => {
        setTypingText((prev) => {
          if (i >= answer.length) {
            if (typingInterval.current) clearInterval(typingInterval.current);
            return answer;
          }
          const next = answer.slice(0, i + 1);
          i++;
          return next;
        });
      }, 18); // tốc độ chữ chạy
      return () => {
        if (typingInterval.current) clearInterval(typingInterval.current);
      };
    }
  }, [expandedFaq, loadingFaq, faqs, faqList]);
  return (
    <div className="w-[420px] h-[620px] text-white bg-gradient-to-b from-[#0B1020] to-[#0D1B2A] border border-white/10 rounded-2xl flex flex-col shadow-2xl overflow-hidden relative z-[1000] backdrop-blur-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1B263B] to-[#0D1B2A] px-4 py-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shadow-inner">🐮</div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Hỗ trợ BeefBeef</p>
            <p className="text-xs text-white/60 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Trực tuyến
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {showInput && (
            <button
              onClick={onShowInput}
              title="Quay lại câu hỏi"
              className="px-2 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/10 border border-white/10 transition"
            >
              Quay lại
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-base"
            title="Đóng"
          >
            ✕
          </button>
        </div>
      </div>

      {!showInput ? (
        <div className="p-4 space-y-3 text-sm">
          <p className="font-semibold text-yellow-300">Câu hỏi thường gặp</p>
          {faqList.map((faq, idx) => {
            const matched = faqs.find(
              (f) =>
                f.question.trim().toLowerCase() === faq.trim().toLowerCase(),
            );
            return (
              <div key={idx}>
                <button
                  onClick={() => handleFaqClick(idx)}
                  className="block text-left w-full bg-white/5 border border-white/10 hover:bg-yellow-300/90 hover:text-black px-4 py-3 rounded-xl transition shadow-sm"
                >
                  <span className="text-xl mr-2">❓</span>
                  {faq}
                </button>
                {loadingFaq === idx && (
                  <div className="flex items-start mt-1">
                    {/* Avatar bot */}
                    <span className="text-2xl mr-3">🤖</span>
                    {/* Bubble loading */}
                    <div className="relative group max-w-[75%]">
                      <div className="inline-block min-w-[80px] px-4 py-3 rounded-2xl shadow bg-white text-black">
                        <div className="flex items-center gap-2">
                          <span className="typing-dots">
                            <span className="dot bg-yellow-400 inline-block w-2 h-2 rounded-full mr-1 animate-bounce [animation-delay:0ms]"></span>
                            <span className="dot bg-yellow-400 inline-block w-2 h-2 rounded-full mr-1 animate-bounce [animation-delay:150ms]"></span>
                            <span className="dot bg-yellow-400 inline-block w-2 h-2 rounded-full animate-bounce [animation-delay:300ms]"></span>
                          </span>
                          <span className="text-gray-500 text-sm">
                            Đang trả lời...
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {expandedFaq === idx && !loadingFaq && (
                  <div className="bg-white text-black px-4 py-3 rounded-b-xl shadow border-l-4 border-yellow-300 mt-1 min-h-[28px]">
                    <span>{typingText}</span>
                  </div>
                )}
              </div>
            );
          })}
          <button
            onClick={onShowInput}
            className="mt-4 text-sm underline hover:text-yellow-300 flex items-center gap-2"
          >
            <span>🤖</span>
            <span>Trợ lý bằng AI</span>
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto hide-scrollbar px-4 py-3 space-y-3 text-sm scrollbar-thin scrollbar-thumb-yellow-400/80 scrollbar-track-transparent scrollbar-thumb-rounded-full hover:scrollbar-thumb-yellow-500 overflow-x-visible">
            {messages.map((msg, idx) => {
              const text = msg.text || msg.content || '';
              const senderId = msg.sender_id || '';
              const isMine = senderId === currentUserId || senderId === 'user';
              const messageType = msg.message_type || 'text';
              // Nếu là tin nhắn ảnh, lấy từ trường image (backend trả về)
              const attachments = messageType === 'image'
                ? (msg.image || msg.attachments || [])
                : (msg.attachments || []);

              return (
                <div
                  key={idx}
                  className={`flex items-start ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Avatar trái */}
                  {!isMine && (
                    <img
                      src="/bot-avatar.png"
                      alt="avatar"
                      className="w-8 h-8 rounded-full mr-3 shrink-0 ring-2 ring-white/10"
                    />
                  )}

                  {/* Bubble + Emoji */}
                  <div
                    className="relative group max-w-[75%]"
                    onMouseEnter={() => {
                      setHoveredIdx(idx);
                      // Hover vào bubble cũng giữ dải emoji
                      if (reactionPickerLock) {
                        if (hideActionTimeout.current) {
                          clearTimeout(hideActionTimeout.current);
                          hideActionTimeout.current = null;
                        }
                      }
                      if (actionHideTimeout.current) {
                        clearTimeout(actionHideTimeout.current);
                        actionHideTimeout.current = null;
                      }
                    }}
                    onMouseLeave={() => {
                      // Khi rời chuột khỏi bubble, giữ lại 400ms rồi mới ẩn nút hành động để dễ di chuột
                      actionHideTimeout.current = setTimeout(() => {
                        setHoveredIdx((prev) => (prev === idx ? null : prev));
                      }, 400);
                      // Giữ dải emoji thêm 2s
                      if (reactionPickerLock) {
                        hideActionTimeout.current = setTimeout(() => {
                          setReactionPickerLock(false);
                          setReactionPickerIdx(null);
                        }, 2000);
                      }
                    }}
                  >
                    <div
                      className={`
                        inline-block min-w-[80px] ${isMine ? 'px-3 py-2' : 'px-2.5 py-2'} rounded-2xl shadow
                        whitespace-pre-wrap break-words
                        ${isMine ? 'bg-gradient-to-br from-yellow-300 to-amber-200 text-black border border-amber-300/40' : 'bg-white text-black text-xs border border-black/5'}
                        ${!isMine ? 'max-h-[320px] overflow-y-auto' : ''}
                      `}
                    >
                      {/* Nội dung text */}
                      {(!isMine && messageType === 'text') ? (
                        <ReactMarkdown
                          components={{
                            a: (props) => <a {...props} className="text-blue-600 underline break-all" target="_blank" rel="noopener noreferrer" />,
                            strong: (props) => <strong className="font-bold text-yellow-700" {...props} />,
                            del: (props) => <span className="line-through text-gray-500" {...props} />,
                            p: (props) => <p className="mb-2" {...props} />,
                            ul: (props) => <ul className="list-disc ml-4" {...props} />,
                            li: (props) => <li className="mb-1" {...props} />,
                          }}
                        >{text}</ReactMarkdown>
                      ) : (
                        <p>{text}</p>
                      )}

                      {/* Hiển thị hình ảnh nếu có */}
                      {messageType === 'image' && attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {attachments.map((imageUrl, imgIdx) => (
                            <div key={imgIdx} className="relative">
                              <img
                                src={imageUrl}
                                alt={`Hình ảnh ${imgIdx + 1}`}
                                className="max-w-full h-auto rounded-xl border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => window.open(imageUrl, '_blank')}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                              <div className="text-xs text-gray-500 mt-1">
                                📸 Click để xem ảnh gốc
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Thời gian */}
                      <p className="text-[11px] text-gray-500 mt-1 text-right">{formatTime(msg.sent_at)}</p>
                    </div>

                    {/* ✅ Reactions hiển thị gọn như Messenger */}
                    {msg.reactions && msg.reactions.length > 0 && (() => {
                      const { items, total } = aggregateReactions(msg.reactions);
                      return (
                        <div
                          className={`absolute text-[13px] font-medium ${
                            isMine ? 'bottom-[-14px] left-[-6px]' : 'bottom-[-14px] right-[-6px]'
                          } bg-white rounded-full border border-gray-200 shadow px-1.5 py-[2px] flex items-center gap-1`}
                        >
                          {items.map(({ emoji }, i) => (
                            <span key={i} className="leading-none">{emoji}</span>
                          ))}
                          <span className="text-xs text-gray-600 ml-0.5">{total}</span>
                        </div>
                      );
                    })()}

                    {/* Hover actions */}
                    <div
                      className={`
                        absolute top-1/2 -translate-y-1/2 z-[50] gap-1
                        ${isMine ? 'right-full mr-2' : 'left-full ml-2'}
                        ${hoveredIdx === idx ? 'flex' : 'hidden group-hover:flex'}
                      `}
                    >
                      <button
                        onClick={() => {
                          const previewText = (msg.text || msg.content || '').slice(0, 120);
                          if (msg._id) setReplyTarget({ id: msg._id, preview: previewText });
                        }}
                        className="action-btn w-8 h-8 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:scale-110 transition focus:outline-none focus:ring-2 focus:ring-yellow-300"
                        style={{ zIndex: 60 }}
                        tabIndex={0}
                        title="Reply"
                      >
                        <FiCornerDownLeft className="text-gray-800" />
                      </button>
                      <button
                        onClick={() => {
                          // Click để mở/đóng dải emoji (ưu tiên click)
                          if (reactionPickerIdx === idx && reactionPickerLock) {
                            setReactionPickerLock(false);
                            setReactionPickerIdx(null);
                          } else {
                            setReactionPickerIdx(idx);
                            setReactionPickerLock(true);
                            currentMsgIdRef.current = msg._id || '';
                          }
                          if (hideActionTimeout.current) {
                            clearTimeout(hideActionTimeout.current);
                            hideActionTimeout.current = null;
                          }
                        }}
                        className="action-btn w-8 h-8 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:scale-110 transition"
                        title="Emoji"
                      >
                        😊
                      </button>
                      <button
                        onClick={() => alert('More')}
                        className="action-btn w-8 h-8 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:scale-110 transition"
                        title="More"
                      >
                        <FiMoreVertical className="text-gray-800" />
                      </button>
                      {reactionPickerIdx === idx && reactionPickerLock && (
                        <div
                          ref={reactionPickerRef}
                          className={`absolute -top-12 ${isMine ? 'right-0' : 'left-0'} z-[9999] bg-white rounded-full shadow-lg flex items-center gap-2 px-2.5 py-1.5 border border-gray-200`} 
                          style={{ pointerEvents: 'auto' }}
                          onMouseEnter={() => {
                            // Hover vào dải emoji thì giữ lại, clear timeout
                            if (hideActionTimeout.current) {
                              clearTimeout(hideActionTimeout.current);
                              hideActionTimeout.current = null;
                            }
                          }}
                          onMouseLeave={() => {
                            // Khi rời chuột khỏi dải emoji, giữ lại 2s rồi mới ẩn nếu không click
                            hideActionTimeout.current = setTimeout(() => {
                              setReactionPickerLock(false);
                              setReactionPickerIdx(null);
                            }, 2000);
                          }}
                        >
                          {popularEmojis.map((emoji) => (
                            <button
                              key={emoji}
                              className="text-xl hover:scale-110 transition focus:outline-none"
                              onClick={() => {
                                if (currentMsgIdRef.current) {
                                  handleReactToMessage(currentMsgIdRef.current, emoji);
                                }
                                setReactionPickerLock(false);
                                setReactionPickerIdx(null);
                                if (hideActionTimeout.current) {
                                  clearTimeout(hideActionTimeout.current);
                                  hideActionTimeout.current = null;
                                }
                              }}
                            >
                              {emoji}
                            </button>
                          ))}
                          <button
                            className="ml-1 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 border flex items-center justify-center text-lg"
                            onClick={() => setReactionFullPickerIdx(idx)}
                            title="Thêm emoji"
                          >
                            +
                          </button>
                        </div>
                      )}
                      {reactionFullPickerIdx === idx && (
                        <div className="absolute -top-40 left-1/2 -translate-x-1/2 z-[9999]" onMouseLeave={() => setReactionFullPickerIdx(null)}>
                          <EmojiPicker
                            theme={Theme.DARK}
                            onEmojiClick={(e) => {
                              if (currentMsgIdRef.current) {
                                handleReactToMessage(currentMsgIdRef.current, e.emoji);
                              }
                              setReactionFullPickerIdx(null);
                              setReactionPickerIdx(null);
                              setReactionPickerLock(false);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Avatar phải */}
                  {isMine && (
                    <img
                      src="/user-avatar.png"
                      alt="avatar"
                      className="w-8 h-8 rounded-full ml-3 shrink-0 ring-2 ring-white/10"
                    />
                  )}
                </div>
              );
            })}

            <div ref={messageEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/10 p-3 bg-[#0D1B2A]/80 flex flex-col gap-2 relative overflow-visible">
            {replyTarget && (
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5">↩️</span>
                  <div className="text-white/80 truncate max-w-[270px]">
                    <span className="text-white/60">Trả lời: </span>
                    {replyTarget.preview}
                  </div>
                </div>
                <button className="text-white/60 hover:text-white" onClick={() => setReplyTarget(null)} title="Bỏ trả lời">✕</button>
              </div>
            )}
            <div className="flex items-center gap-2 relative z-20">
              <div className="flex items-center gap-1 relative z-20">
              <button
                className="text-white/90 hover:text-yellow-300 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded-lg px-2"
                style={{ zIndex: 30 }}
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                tabIndex={0}
                aria-label="Chọn emoji"
              >
                😊
              </button>
              <label className="cursor-pointer text-white/90 hover:text-yellow-300 text-lg rounded-lg px-2" style={{ zIndex: 30 }}>
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
                className="text-white/90 hover:text-yellow-300 text-lg rounded-lg px-2"
                style={{ zIndex: 30 }}
                tabIndex={0}
                aria-label="Ghi âm"
              >
                🎤
              </button>
              <button
                onClick={() => alert('🔗 Gửi link sẽ sớm được hỗ trợ')}
                className="text-white/90 hover:text-yellow-300 text-lg rounded-lg px-2"
                style={{ zIndex: 30 }}
                tabIndex={0}
                aria-label="Đính kèm liên kết"
              >
                🔗
              </button>
            </div>
              
              <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 min-w-0">
                <input
                  value={input}
                  onChange={(e) => onInputChange(e.target.value)}
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/50 min-w-0"
                  placeholder="Nhập tin nhắn, emoji, đính kèm..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendClick();
                    }
                  }}
                />
                {selectedImage && (
                  <div className="shrink-0 max-w-[80px] max-h-[60px] overflow-hidden rounded-lg border border-white/10 mr-2">
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      className="w-full h-full object-cover"
                      alt="preview"
                    />
                  </div>
                )}
                <button
                  onClick={handleSendClick}
                  className="shrink-0 w-10 h-10 bg-gradient-to-br from-yellow-300 to-amber-300 text-black rounded-xl flex items-center justify-center hover:brightness-110 shadow"
                  aria-label="Gửi"
                >
                  <FiSend size={18} />
                </button>
              </div>
            </div>

            {showEmojiPicker && (
              <div className="absolute bottom-[94px] left-2 z-[9999] max-w-[300px]" style={{ pointerEvents: 'auto' }}>
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
