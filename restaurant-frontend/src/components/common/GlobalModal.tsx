import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface GlobalModalProps {
  children: React.ReactNode;
}

const modalRoot =
  typeof window !== 'undefined' ? document.getElementById('modal-root') : null;

const GlobalModal: React.FC<GlobalModalProps> = ({ children }) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, []);

  if (!modalRoot) return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-60 flex items-center justify-center">
      {children}
    </div>,
    modalRoot,
  );
};

export default GlobalModal;
