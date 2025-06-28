// TableItem.tsx
import React from 'react';
interface TableItemProps {
  id: string;
  name: string;
  status: 'available' | 'reserved' | 'selected';
  onClick: () => void;
  x: number;
  y: number;
}

const TableItem: React.FC<TableItemProps> = ({
  id,
  name,
  status,
  onClick,
  x,
  y,
}) => {
  const bgColor =
    status === 'selected'
      ? 'bg-[#F9D783]'
      : status === 'reserved'
        ? 'bg-[#4B5563]'
        : 'bg-[#1F2937]';

  const textColor = status === 'selected' ? 'text-black' : 'text-white';

  return (
    <div
      className="absolute flex flex-col items-center"
      style={{ left: `${x * 100}px`, top: `${y * 80}px` }}
    >
      {/* Ghế xung quanh */}
      <div className="absolute -top-3 w-3 h-3 rounded-full bg-yellow-400"></div>
      <div className="absolute -bottom-3 w-3 h-3 rounded-full bg-yellow-400"></div>
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-yellow-400"></div>
      <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-yellow-400"></div>

      {/* Bàn */}
      <button
        className={`w-28 h-12 rounded-md shadow-md flex items-center justify-center font-semibold ${bgColor} ${textColor}`}
        onClick={status !== 'reserved' ? onClick : undefined}
        disabled={status === 'reserved'}
      >
        {name}
      </button>
    </div>
  );
};

export default TableItem;
