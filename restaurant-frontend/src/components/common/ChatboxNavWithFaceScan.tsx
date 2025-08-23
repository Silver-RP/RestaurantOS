import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FaceScanModal from '@/components/common/FaceScanModal';

interface Props {
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  currentPath: string;
}

const ChatboxNavWithFaceScan: React.FC<Props> = ({ icon, label, expanded, currentPath }) => {
  const [open, setOpen] = useState(false);
  const [shiftInfo, setShiftInfo] = useState<{
    shift: string;
    action: string;
    verifiedAt: string;
  } | null>(null);
  const navigate = useNavigate();
  const isActive = currentPath === '/admin/chatbox';

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    navigate('/admin/chatbox');
  };

  // Hàm xử lý Out ca (check-out)
  const handleOutShift = () => {
    setOpen(true); // Mở lại modal để xác thực check-out
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`flex items-center px-4 py-2 rounded-lg transition-colors w-full ${expanded ? 'justify-start gap-3' : 'justify-center'} ${isActive ? '!bg-[#012B40] !text-[#ffffff]' : 'hover:bg-adminhover'}`}
      >
        <span className="text-lg">{icon}</span>
        {expanded && <span className="text-left w-full">{label}</span>}
      </button>
      {open && (
        <FaceScanModal
          onClose={handleClose}
          onVerified={data => setShiftInfo(data)}
        />
      )}
     
    </>
  );
};

export default ChatboxNavWithFaceScan;
