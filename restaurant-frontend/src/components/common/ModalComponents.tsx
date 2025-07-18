import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-bodyBackground rounded-lg w-full max-w-[400px] sm:max-w-[600px] max-h-[90vh] overflow-y-auto relative p-6 shadow-lg"
        style={{ width: '90vw', maxWidth: 400 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-[#F9D783] text-[#1a2233] text-2xl font-bold shadow cursor-pointer transition z-10 "
          aria-label="Đóng"
        >
          ×
        </button>

        {title && <h3 className="text-xl mb-4">{title}</h3>}

        <div className="scrollbar-custom pr-2">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
