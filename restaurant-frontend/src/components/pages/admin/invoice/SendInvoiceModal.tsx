import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useSendInvoiceEmail } from '@/hooks/useOrder';

interface SendInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  defaultEmail?: string;
}

const SendInvoiceModal: React.FC<SendInvoiceModalProps> = ({
  isOpen,
  onClose,
  orderId,
  defaultEmail = '',
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEmail(defaultEmail);
  }, [defaultEmail]);

  const { mutate: sendInvoice } = useSendInvoiceEmail();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSend = () => {
    if (!email) {
      setError('Email là bắt buộc');
      return;
    }

    if (!validateEmail(email)) {
      setError('Email không hợp lệ');
      return;
    }

    setIsLoading(true);
    sendInvoice(
      { orderId, email },
      {
        onSuccess: () => {
          setIsLoading(false);
          onClose();
        },
        onError: () => {
          setIsLoading(false);
        },
      },
    );
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="border-b">
        <h2 className="text-lg font-semibold">Gửi hóa đơn qua email</h2>
      </DialogTitle>
      <DialogContent className="mt-4">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 
                ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              placeholder="Nhập email người nhận"
              disabled={isLoading}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Đang gửi...' : 'Gửi'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendInvoiceModal;
