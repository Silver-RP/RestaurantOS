import { messaging } from '../firebase/firebase';
import { getToken } from 'firebase/messaging';
import axios from 'axios';

export const registerFcmToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Bạn chưa cấp quyền thông báo!');
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: 'BJAgb1b1VLC8FyNIRb6mbBm3JfQZbLEuilLnVbLF-5SkU_hG2SlM_0mTfOmpmDrIEghst0KWfEkPZXp2HWjo6Co', \
    });

    if (token) {
      console.log('FCM Token:', token);
      await axios.post('/fcm/register', { token }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` \
        }
      });

      console.log('Gửi token về server thành công!');
    } else {
      console.warn('Không thể lấy FCM token');
    }
  } catch (error) {
    console.error('Lỗi khi đăng ký FCM:', error);
  }
};
