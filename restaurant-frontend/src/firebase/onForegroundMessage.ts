
import { messaging, onMessage } from '../firebase/firebase';

export const listenToForegroundMessages = () => {
  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    alert(`🔔 ${payload?.notification?.title}\n${payload?.notification?.body}`);
  });
};
