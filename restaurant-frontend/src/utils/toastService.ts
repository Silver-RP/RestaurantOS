import { toast, Id, Slide } from 'react-toastify';

const toastQueue: Id[] = [];
const MAX_TOAST = 2;

const pushToast = (type: 'success' | 'error' | 'warning' | 'info', message: string, options = {}) => {
  if (toastQueue.length >= MAX_TOAST) {
    const oldest = toastQueue.shift();
    if (oldest) {
      toast.dismiss(oldest);
    }
  }
  const id = toast[type](message, {
    transition: Slide, 
    ...options,
  });
  toastQueue.push(id);
};

export const toastService = {
  success: (msg: string, options = {}) => pushToast('success', msg, options),
  error: (msg: string, options = {}) => pushToast('error', msg, options),
  warning: (msg: string, options = {}) => pushToast('warning', msg, options),
  info: (msg: string, options = {}) => pushToast('info', msg, options),
};