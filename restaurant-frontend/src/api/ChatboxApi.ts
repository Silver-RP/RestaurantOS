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
}: SendMessageAPIRequest): Promise<ChatMessage> => {
  const { data } = await axiosInstance.post(`/chat/${chatId}/message`, {
    content,
    replyTo,
    senderId,
    role,
  });
  return data.message;
};

// Cashier lấy hoặc tạo phiên chat với user cụ thể
export const getUserChatSession = async (
  userId: string,
): Promise<ChatSessionResponse> => {
  const { data } = await axiosInstance.get(`/chat/user/${userId}`);
  console.log('getUserChatSession response:', data);
  return data.chat;
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
