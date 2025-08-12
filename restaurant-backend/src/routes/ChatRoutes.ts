import { Router } from 'express';
const router = Router();
import ChatController from '../controller/ChatController';
import { verifyChatPermission } from '../middleware/ChatPermission';
import upload from '../middleware/UploadMiddleWare';

router.get('/me', ChatController.getMyChat); 
router.get('/me/cashier', ChatController.listChats); 
router.get('/user/:userId', ChatController.getOrCreateUserChat); 
router.get('/:chatId/messages', verifyChatPermission, ChatController.getChatMessages); 
router.post(
  '/:chatId/message',
  verifyChatPermission,
  upload.fields([
    { name: 'image', maxCount: 5 },
    { name: 'audio', maxCount: 5 }
  ]),
  ChatController.sendMessage
);
router.patch('/:chatId/read', verifyChatPermission, ChatController.markMessageAsRead);
router.post('/:chatId/assign', ChatController.assignCashier); 
router.get('/unread-count', ChatController.getUnreadMessageCount); 
router.delete(
  '/:chatId/message/:messageId',
  verifyChatPermission,
  ChatController.deleteMessage,
);
router.patch(
  '/:chatId/message/:messageId',
  verifyChatPermission,
  ChatController.editMessage,
);
router.post('/:chatId/typing', verifyChatPermission, ChatController.typingIndicator);

export default router;
/*
https://platform.openai.com/api-keys
*/
