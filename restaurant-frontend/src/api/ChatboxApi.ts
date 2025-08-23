import {
  ChatMessage,
  ChatSessionResponse,
  GetMessagesResponse,
  SendMessageAPIRequest,
} from '@/types/Chatbox.type';
import axiosInstance from './axiosInstance';

// 1. Lấy hoặc tạo phiên chat cho user hiện tại
export const getChatSession = async (): Promise<ChatSessionResponse> => {
  const { data } = await axiosInstance.get('/chat/me');
  return data.chat;
};

// 2. Lấy tin nhắn trong 1 phiên chat cụ thể (hỗ trợ phân trang với ?before=id) (user và cashier đúng ko )
export const getMessages = async (
  chatId: string,
  before?: string,
): Promise<ChatMessage[]> => {
  const params = before ? { before } : {};
  const { data } = await axiosInstance.get<GetMessagesResponse>(
    `/chat/${chatId}/messages`,
    { params },
  );
  return data.messages;
};

// 3. Gửi tin nhắn mới
export const sendMessage = async ({
  chatId,
  content,
  replyTo,
  senderId,
  role,
  image,
  audio,
  clientTempId,
}: SendMessageAPIRequest & { image?: string[]; audio?: string[]; clientTempId?: string }): Promise<ChatMessage> => {
  let dataToSend: any = {};
  let config: any = {};

  // Nếu có ảnh hoặc audio, gửi qua FormData
  if ((image && Array.isArray(image) && image.length > 0) || (audio && Array.isArray(audio) && audio.length > 0)) {
    const formData = new FormData();
    if (content) formData.append('content', content);
    if (replyTo) formData.append('replyTo', replyTo);
    if (senderId) formData.append('senderId', senderId);
    if (role) formData.append('role', role);
    if (clientTempId) formData.append('clientTempId', clientTempId);
    if (image) {
      image.forEach((img, idx) => {
        if (img.startsWith('data:')) {
          const arr = img.split(',');
          const mimeMatch = arr[0].match(/:(.*?);/);
          const mime = mimeMatch ? mimeMatch[1] : 'image/png';
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) u8arr[n] = bstr.charCodeAt(n);
          const file = new File([u8arr], `image_${idx}.png`, { type: mime });
          formData.append('image', file);
        }
      });
    }
    if (audio) {
      audio.forEach((aud, idx) => {
        if (aud.startsWith('data:')) {
          const arr = aud.split(',');
          const mimeMatch = arr[0].match(/:(.*?);/);
          const mime = mimeMatch ? mimeMatch[1] : 'audio/webm';
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) u8arr[n] = bstr.charCodeAt(n);
          const file = new File([u8arr], `audio_${idx}.webm`, { type: mime });
          formData.append('audio', file);
        }
      });
    }
    dataToSend = formData;
    config = { headers: { 'Content-Type': 'multipart/form-data' } };
  } else {
    // Nếu không có ảnh/audio, gửi JSON như cũ
  dataToSend = { content, replyTo, senderId, role };
  if (clientTempId) dataToSend.clientTempId = clientTempId;
    config = {};
  }

  const { data } = await axiosInstance.post(`/chat/${chatId}/message`, dataToSend, config);
  return data.message;
};

// Cashier lấy hoặc tạo phiên chat với user cụ thể
export const getUserChatSession = async (
  userId: string,
): Promise<ChatSessionResponse> => {
  const { data } = await axiosInstance.get(`/chat/user/${userId}`);
  console.log('getUserChatSession response:', data);

  const chat = data.chat as any;

  // nếu backend đã populate user object thì trả luôn
  if (chat?.user && (typeof chat.user === 'object')) {
    return chat as ChatSessionResponse;
  }

  // nếu backend trả user_id (objectId/string) -> gọi thêm API lấy user info
  const userIdFromChat = chat?.user_id || chat?.userId || userId;
  if (userIdFromChat) {
    try {
      const { data: userData } = await axiosInstance.get(`/users/${String(userIdFromChat)}`);
      chat.user = userData.user || userData; // tùy backend shape
    } catch (err) {
      console.warn('Failed to fetch user detail for chat; continuing with chat as-is', err);
      // không ném lỗi để UI vẫn hiện phần chat (có thể thiếu info)
    }
  }

  return chat as ChatSessionResponse;
};

// Cashier xem danh sách các phiên chat
export const getAllUserChats = async (): Promise<ChatSessionResponse[]> => {
  const { data } = await axiosInstance.get('/chat/me/cashier');
  console.log('getAllUserChats response:', data);

  return data.chats;
};

// Gán cashier vào xử lý phiên chat
export const assignCashierSession = async (chatId: string): Promise<void> => {
  await axiosInstance.post(`/chat/${chatId}/assign`);
};

// Lấy số lượng tin nhắn chưa đọc của user/cashier
export const getUnreadMessageCount = async (): Promise<number> => {
  const { data } = await axiosInstance.get('/chat/unread-count');
  console.log('getUnreadMessageCount response:', data);
  
  return data.unreadCount;
};

export const markMessageAsRead = async (chatId: string, messageId: string): Promise<void> => {
  await axiosInstance.patch(`/chat/${chatId}/read`, { messageId });
};

export const deleteMessage = async (chatId: string, messageId: string): Promise<void> => {
  await axiosInstance.delete(`/chat/${chatId}/message/${messageId}`);
};