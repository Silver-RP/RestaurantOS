import ChatMessageModel from '../models/ChatMessageModel';
import mongoose from 'mongoose';
import { ChatSession, SendMessageDto, ChatMessage } from '../types/chatbox.types';
import ChatBoxModel from '../models/ChatBoxModel';

class ChatService {
  async getOrCreateChat(userId: string): Promise<ChatSession> {
    let chat = await ChatBoxModel.findOne({
      user_id: userId,
      status: { $in: ['open', 'pending'] },
    });

    if (!chat) {
      chat = await ChatBoxModel.create({
        user_id: userId,
        status: 'pending',
      });
    }

    return {
      ...chat.toObject(),
      _id: (chat._id as mongoose.Types.ObjectId | string).toString(),
    } as ChatSession;
  }

  async getMessagesWithPagination(
    chatId: string,
    before?: string,
    limit: number = 20,
  ): Promise<ChatMessage[]> {
    const filter: any = { chat_id: chatId };

    if (before && mongoose.Types.ObjectId.isValid(before)) {
      filter._id = { $lt: new mongoose.Types.ObjectId(before) }; // load tin cũ hơn
    }

    const messages = await ChatMessageModel.find(filter)
      .populate('reply_to', 'content sender_id')
      .sort({ _id: -1 }) // mới nhất trước
      .limit(limit)
      .lean();

    // Trả về theo thứ tự đúng thời gian (cũ → mới)
    return messages.reverse().map((msg: any) => ({
      ...msg,
      _id: msg._id.toString(),
      chat_id: msg.chat_id?.toString(),
      sender_id: msg.sender_id?.toString(),
      receiver_id: msg.receiver_id?.toString(),
      reply_to: msg.reply_to
        ? {
            ...msg.reply_to,
            _id: msg.reply_to._id?.toString(),
            sender_id: msg.reply_to.sender_id?.toString(),
          }
        : null,
    })) as ChatMessage[];
  }

  async sendMessage(data: SendMessageDto): Promise<ChatMessage> {
    const chat = await ChatBoxModel.findById(data.chatId);
    if (!chat) throw new Error('CHAT_NOT_FOUND');

    if (data.role === 'user' && !chat.cashier_user_id) {
      const { getBotReply } = await import('../utils/openaiBot');
      const botReply = await getBotReply(data.content);
      console.log('[🤖 BOT REPLY]:', botReply);
      const botMessage = await ChatMessageModel.create({
        chat_id: chat._id,
        sender_id: new mongoose.Types.ObjectId(process.env.BOT_ID || '000000000000000000000001'),
        receiver_id: new mongoose.Types.ObjectId(data.senderId),
        sender_role: 'bot',
        content: botReply,
        is_bot_reply: true,
        message_type: 'text',
        sent_at: new Date(),
      });

      if (globalThis.io) {
        globalThis.io.to(data.chatId).emit('message', {
          ...botMessage.toObject(),
          _id: (botMessage._id as mongoose.Types.ObjectId).toString(),
        });
      }
    }

    const receiverId = data.role === 'cashier' ? chat.user_id : chat.cashier_user_id;

    const senderRole =
      typeof data.role === 'string' ? data.role : Array.isArray(data.role) ? data.role[0] : 'user';

    const message = await ChatMessageModel.create({
      chat_id: new mongoose.Types.ObjectId(data.chatId),
      sender_id: new mongoose.Types.ObjectId(data.senderId),
      receiver_id: new mongoose.Types.ObjectId(receiverId),
      sender_role: senderRole,
      content: data.content,
      is_bot_reply: data.is_bot_reply || false,
      message_type: data.message_type || 'text',
      sent_at: new Date(),
      read_at: null,
      reply_to: data.replyTo ? new mongoose.Types.ObjectId(data.replyTo) : null,
    });

    console.log('[🟢 DEBUG] Message sent:', data);

    return {
      ...message.toObject(),
      _id: (message._id as mongoose.Types.ObjectId).toString(),
    } as ChatMessage;
  }

  async listChatsOfCashierAdvanced({
    cashierId,
    page = 1,
    limit = 10,
    status,
  }: {
    cashierId: string;
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const query: any = { cashier_user_id: cashierId };
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const chats = await ChatBoxModel.find(query)
      .populate('user_id', 'username avatar')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const enrichedChats = await Promise.all(
      chats.map(async (chat) => {
        const lastMsg = await ChatMessageModel.findOne({ chat_id: chat._id })
          .sort({ sent_at: -1 })
          .lean();

        return {
          ...chat,
          lastMessage: lastMsg?.content || '',
          lastMessageTime: lastMsg?.sent_at || chat.updated_at,
        };
      }),
    );

    return enrichedChats;
  }

  async markMessageAsRead(chatId: string, messageId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      throw new Error('INVALID_CHAT_ID');
    }
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      throw new Error('INVALID_MESSAGE_ID');
    }
    await ChatMessageModel.updateOne(
      {
        _id: new mongoose.Types.ObjectId(messageId), // ép kiểu rõ ràng ✅
        chat_id: new mongoose.Types.ObjectId(chatId),
        read_at: null,
      },
      {
        $set: { read_at: new Date() },
      },
    );
  }

  async assignCashierToChat(chatId: string, cashierId: string) {
    const chat = await ChatBoxModel.findById(chatId);

    if (!chat) {
      throw new Error('CHAT_NOT_FOUND');
    }

    if (chat.cashier_user_id) {
      throw new Error('ALREADY_ASSIGNED');
    }

    chat.cashier_user_id = new mongoose.Types.ObjectId(cashierId);
    await chat.save();

    return {
      ...chat.toObject(),
      _id: (chat._id as mongoose.Types.ObjectId | string).toString(),
    };
  }

  async getOrCreateChatWithUser(userId: string, cashierId: string) {
    let chat = await ChatBoxModel.findOne({
      user_id: userId,
      status: { $in: ['pending', 'open'] },
    });

    if (!chat) {
      chat = await ChatBoxModel.create({
        user_id: userId,
        cashier_user_id: cashierId,
        status: 'pending',
      });
    } else if (!chat.cashier_user_id) {
      await ChatBoxModel.updateOne({ _id: chat._id }, { cashier_user_id: cashierId });
      // Lấy lại bản ghi sau khi cập nhật
      chat = await ChatBoxModel.findById(chat._id);
    }

    if (!chat) {
      throw new Error('CHAT_NOT_FOUND');
    }
    return {
      ...chat.toObject(),
      _id: (chat._id as mongoose.Types.ObjectId | string).toString(),
    };
  }

  async getUnreadMessageCount(userId: string, role: 'user' | 'cashier'): Promise<number> {
    if (role === 'user') {
      return await ChatMessageModel.countDocuments({
        receiver_id: userId,
        read_at: null,
      });
    } else if (role === 'cashier') {
      const chats = await ChatBoxModel.find({ cashier_user_id: userId }, '_id').lean();
      const chatIds = chats.map((c) => c._id);
      return await ChatMessageModel.countDocuments({
        chat_id: { $in: chatIds },
        sender_role: 'user',
        read_at: null,
      });
    }
    return 0;
  }

  async softDeleteMessage(chatId: string, messageId: string, userId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(chatId) || !mongoose.Types.ObjectId.isValid(messageId)) {
      throw new Error('INVALID_ID');
    }

    const message = await ChatMessageModel.findOne({ _id: messageId, chat_id: chatId });

    if (!message) {
      throw new Error('MESSAGE_NOT_FOUND');
    }

    const senderId = message.sender_id?.toString();
    const currentUserId = userId?.toString();

    console.log('[🟡 DEBUG]', { senderId, currentUserId });

    if (senderId !== currentUserId) {
      throw new Error('FORBIDDEN');
    }

    message.is_deleted = true;
    await message.save();
  }

  async editMessage(
    chatId: string,
    messageId: string,
    userId: string,
    newContent: string,
  ): Promise<void> {
    const message = await ChatMessageModel.findOne({ _id: messageId, chat_id: chatId });

    if (!message) {
      throw new Error('MESSAGE_NOT_FOUND');
    }

    if (message.sender_id.toString() !== userId.toString()) {
      throw new Error('FORBIDDEN');
    }

    const allowEditAfterSeconds = Infinity;

    const timeDiff = (Date.now() - new Date(message.sent_at).getTime()) / 1000;
    if (timeDiff > allowEditAfterSeconds) {
      throw new Error('EDIT_TIME_EXPIRED');
    }

    message.content = newContent;
    message.edited = true;
    message.edited_at = new Date();

    await message.save();
  }
}

export default new ChatService();
