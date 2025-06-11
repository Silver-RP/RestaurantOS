import { messaging, getToken } from './firebase';

export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    const token = await getToken(messaging, {
      vapidKey: 'BJAgb1b1VLC8FyNIRb6mbBm3JfQZbLEuilLnVbLF-5SkU_hG2SlM_0mTfOmpmDrIEghst0KWfEkPZXp2HWjo6Co',
    });

    if (token) {
      console.log('FCM token:', token);
      return token;
    } else {
      console.warn('No registration token available.');
      return null;
    }
  } catch (err) {
    console.error('An error occurred while retrieving token.', err);
    return null;
  }
};