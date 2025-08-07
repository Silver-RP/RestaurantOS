/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
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
  faqs,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [reactionPickerIdx, setReactionPickerIdx] = useState<number | null>(null);
  const [reactionPickerLock, setReactionPickerLock] = useState(false);
  const hideActionTimeout = useRef<NodeJS.Timeout | null>(null);
  const reactionPickerRef = useRef<HTMLDivElement | null>(null);
  const popularEmojis = ['😂', '😍', '👍', '😢', '😮', '😡', '❤️', '😆'];
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

  const handleReactToMessage = (messageId: string, emoji: string) => {
    if (!currentUserId) return;
    socket.emit('reactMessage', {
      messageId,
      emoji,
      userId: currentUserId,
      // chatId: chatId, // Uncomment and provide chatId if needed
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
    <div className="w-[420px] h-[620px] bg-[#0D1B2A] text-white border border-yellow-300 rounded-lg flex flex-col shadow-lg overflow-hidden relative z-[1000]">
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
          <p className="font-semibold text-yellow-300">Câu hỏi thường gặp:</p>
          {faqList.map((faq, idx) => {
            const matched = faqs.find(
              (f) =>
                f.question.trim().toLowerCase() === faq.trim().toLowerCase(),
            );
            return (
              <div key={idx}>
                <button
                  onClick={() => handleFaqClick(idx)}
                  className="block text-left w-full bg-[#1B263B] text-white hover:bg-yellow-300 hover:text-black px-4 py-3 rounded transition"
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
                      <div className="inline-block min-w-[80px] px-4 py-3 rounded-lg shadow bg-white text-black">
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
                  <div className="bg-white text-black px-4 py-3 rounded-b shadow border-l-4 border-yellow-300 animate-fadeIn mt-1 min-h-[28px]">
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
          {/* Message display */}
          <div className="flex-1 overflow-y-auto hide-scrollbar px-4 py-3 space-y-3 text-sm scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-transparent scrollbar-thumb-rounded-full hover:scrollbar-thumb-yellow-500">
            {messages.map((msg, idx) => {
              const text = msg.text || msg.content || '';
              const senderId = msg.sender_id || '';
              const isMine = senderId === currentUserId || senderId === 'user';
              const messageType = msg.message_type || 'text';
              const attachments = msg.attachments || [];

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
                      className="w-7 h-7 rounded-full mr-3 shrink-0"
                    />
                  )}

                  {/* Bubble + Emoji */}
                  <div
                    className="relative group max-w-[75%]"
                    onMouseEnter={() => {
                      // Hover vào bubble cũng giữ dải emoji
                      if (reactionPickerLock) {
                        if (hideActionTimeout.current) {
                          clearTimeout(hideActionTimeout.current);
                          hideActionTimeout.current = null;
                        }
                      }
                    }}
                    onMouseLeave={() => {
                      // Khi rời chuột khỏi bubble, giữ lại 2s rồi mới ẩn dải emoji nếu đang mở
                      if (reactionPickerLock) {
                        hideActionTimeout.current = setTimeout(() => {
                          setReactionPickerLock(false);
                          setReactionPickerIdx(null);
                        }, 2000);
                      }
                    }}
                  >
                    {/* Tin nhắn */}
                    <div
                      className={`
                          inline-block min-w-[80px] px-4 py-3 rounded-lg shadow
                          whitespace-pre-wrap break-words
                          ${isMine ? 'bg-yellow-300 text-black' : 'bg-white text-black'}
                        `}
                    >
                      {/* Nội dung text */}
                      <p>{text}</p>

                      {/* Hiển thị hình ảnh nếu có */}
                      {messageType === 'image' && attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {attachments.map((imageUrl, imgIdx) => (
                            <div key={imgIdx} className="relative">
                              <img
                                src={imageUrl}
                                alt={`Hình ảnh ${imgIdx + 1}`}
                                className="max-w-full h-auto rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
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
                      <p className="text-xs text-gray-500 mt-1 text-right">
                        {new Date().toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    {/* ✅ Emoji tách rời bên ngoài bubble */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div
                        className={`absolute text-xl ${
                          isMine
                            ? 'bottom-[-12px] left-[-6px]'
                            : 'bottom-[-12px] right-[-6px]'
                        }`}
                      >
                        {msg.reactions.map((r, i) => (
                          <span key={i}>{r.emoji}</span>
                        ))}
                      </div>
                    )}

                    {/* Hover actions */}
                    <div
                      className={`
                        absolute top-1/2 -translate-y-1/2 z-[50] gap-1 hidden group-hover:flex
                        ${isMine ? 'right-full mr-2' : 'left-full ml-2'}
                      `}
                    >
                      <button
                        onClick={() => alert('Reply')}
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
                          className="absolute top-10 left-0 z-[9999] bg-white rounded-lg shadow flex gap-1 px-2 py-1 border border-gray-200"
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
                              className="text-xl hover:scale-125 transition focus:outline-none"
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
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Avatar phải */}
                  {isMine && (
                    <img
                      src="/user-avatar.png"
                      alt="avatar"
                      className="w-7 h-7 rounded-full ml-3 shrink-0"
                    />
                  )}
                </div>
              );
            })}

            <div ref={messageEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-yellow-300 p-2 bg-[#0D1B2A] flex items-center gap-2 relative overflow-visible">
            <div className="flex items-center gap-1 relative z-20">
              <button
                className="text-white hover:text-yellow-300 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
                style={{ zIndex: 30 }}
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                tabIndex={0}
              >
                😊
              </button>
              <label className="cursor-pointer text-white hover:text-yellow-300 text-lg" style={{ zIndex: 30 }}>
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
                className="text-white hover:text-yellow-300 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
                style={{ zIndex: 30 }}
                tabIndex={0}
              >
                🎤
              </button>
              <button
                onClick={() => alert('🔗 Gửi link sẽ sớm được hỗ trợ')}
                className="text-white hover:text-yellow-300 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
                style={{ zIndex: 30 }}
                tabIndex={0}
              >
                🔗
              </button>
            </div>

            <input
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              className="flex-1 px-3 py-[6px] bg-[#0D1B2A] text-white text-sm outline-none border border-white/10 rounded min-w-0"
              placeholder="Nhập tin nhắn, emoji, đính kèm..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendClick();
                }
              }}
            />

            <button
              onClick={handleSendClick}
              className="shrink-0 w-10 h-10 bg-yellow-300 text-black rounded flex items-center justify-center hover:bg-yellow-400 shadow"
            >
              <FiSend size={18} />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-[50px] left-0 z-[9999] max-w-[300px]" style={{ pointerEvents: 'auto' }}>
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
