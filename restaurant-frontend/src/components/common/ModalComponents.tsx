import React from 'react';
import { FiX } from 'react-icons/fi';

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
      <div className="bg-bodyBackground rounded-lg max-w-[800px] w-full max-h-[90vh] overflow-y-auto relative p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
        >
          <FiX size={20} />
        </button>

        {title && <h3 className="text-xl mb-4">{title}</h3>}

        <div className="scrollbar-custom pr-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;