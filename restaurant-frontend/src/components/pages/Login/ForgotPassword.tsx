import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import InputComponent from './InputComponents';
import ButtonComponent from './ButtonComponents';

interface ForgotPasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShowModal(true), 10);
    } else {
      setShowModal(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic gửi email reset (comment tạm thời)
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-all duration-300">
      <div
        className={`bg-[#101014] w-11/12 max-w-md p-6 rounded-2xl relative shadow-xl transform transition-all ${
          showModal ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
          type="button"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-semibold text-white text-center mb-4">Quên Mật Khẩu</h2>
        <p className="text-gray-400 text-center mb-6 text-sm">
          Nhập Email/Số điện thoại để đặt lại mật khẩu.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputComponent
            type="email"
            name="email"
            value={email}
            placeholder="Nhập Email/Số điện thoại"
            onChange={(e) => setEmail(e.target.value)}
          />

            <div className="flex justify-end gap-4 mt-6">
            <ButtonComponent
                htmlType="button"
                text="Hủy"
                onClick={onClose}
            />
            <ButtonComponent
                htmlType="submit"
                text={isSubmitting ? 'Đang gửi...' : 'Gửi Yêu Cầu'}
                disabled={isSubmitting}
            />
            </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;