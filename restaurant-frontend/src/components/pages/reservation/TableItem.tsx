import React from 'react';

export type TableStatus = 'available' | 'reserved' | 'selected' | 'booked';
export type TableType =
  | 'standard'
  | 'group'
  | 'vip'
  | 'stage'
  | 'piano'
  | 'quiet';

interface TableItemProps {
  id: string;
  name: string;
  status: TableStatus;
  type: TableType;
  onClick: () => void;
  x?: number;
  y?: number;
  capacity?: number;
  disabled?: boolean;
}

const getBorderColor = (status: TableStatus) => {
  if (status === 'selected') return 'border-yellow-400';
  if (status === 'booked') return 'border-red-500';
  if (status === 'reserved') return 'border-red-500';
  return 'border-green-500';
};

const getChairColor = (status: TableStatus) => {
  if (status === 'selected') return 'bg-yellow-400';
  if (status === 'booked') return 'bg-red-400';
  if (status === 'reserved') return 'bg-red-400';
  return 'bg-green-400';
};

const TableItem: React.FC<TableItemProps> = ({
  name,
  status,
  type,
  onClick,
  x,
  y,
  capacity = 4,
  disabled = false,
}) => {
  // Bàn đặc biệt giữ nguyên
  if (type === 'stage' || type === 'piano') {
    const bgColor = type === 'stage' ? 'bg-purple-800' : 'bg-orange-300';
    const textColor = type === 'stage' ? 'text-white' : 'text-black';
    const borderColor =
      type === 'stage' ? 'border-purple-300' : 'border-orange-400';
    const sizeClass =
      type === 'stage' ? 'w-48 h-20 text-xl' : 'w-32 h-14 text-lg';
    return (
      <button
        className={`rounded-lg shadow font-bold ${sizeClass} ${bgColor} ${textColor} flex items-center justify-center m-2 border-2 ${borderColor}`}
        style={{
          minWidth: 60,
          position: x !== undefined && y !== undefined ? 'absolute' : undefined,
          left: x,
          top: y,
        }}
        disabled
      >
        {type === 'stage' ? 'SÂN KHẤU' : 'PIANO'}
      </button>
    );
  }

  // Bàn thường
  const borderColor = getBorderColor(status);
  const chairColor = getChairColor(status);
  const sizeClass =
    type === 'group' || capacity > 6
      ? 'w-32 h-14'
      : type === 'vip'
        ? 'w-28 h-14'
        : 'w-20 h-10';

  // Không render ghế cho bàn VIP
  let chairs: React.ReactNode[] = [];
  if (type === 'vip') {
    chairs = [];
  } else if (type === 'quiet' && capacity === 2) {
    // 2 ghế trái/phải, 1 nửa trong bàn, 1 nửa ngoài bàn
    chairs.push(
      <div
        key="left"
        className={`absolute w-5 h-5 rounded-full ${chairColor} opacity-40 z-0 border border-white`}
        style={{
          left: '-9px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />,
    );
    chairs.push(
      <div
        key="right"
        className={`absolute w-5 h-5 rounded-full ${chairColor} opacity-40 z-0 border border-white`}
        style={{
          right: '-9px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />,
    );
  } else if (capacity === 8) {
    // 4 ghế trên, 4 ghế dưới
    for (let i = 0; i < 4; i++) {
      // Trên
      chairs.push(
        <div
          key={`top-${i}`}
          className={`absolute w-5 h-5 rounded-full ${chairColor} opacity-40 z-0 border border-white`}
          style={{
            left: `${6 + i * 32}px`,
            top: '-10px',
          }}
        />,
      );
      // Dưới
      chairs.push(
        <div
          key={`bottom-${i}`}
          className={`absolute w-5 h-5 rounded-full ${chairColor} opacity-40 z-0 border border-white`}
          style={{
            left: `${6 + i * 32}px`,
            bottom: '-10px',
          }}
        />,
      );
    }
  } else if (capacity === 4) {
    // Ghế 4 góc
    const chairPos = [
      { left: '12px', top: '-9px' },
      { right: '12px', top: '-9px' },
      { left: '12px', bottom: '-9px' },
      { right: '12px', bottom: '-9px' },
    ];
    chairs = chairPos.map((pos, idx) => (
      <div
        key={idx}
        className={`absolute w-5 h-5 rounded-full ${chairColor} opacity-40 z-0`}
        style={{ ...pos }}
      />
    ));
  } else if (capacity > 6) {
    // 1 nửa bên trái, 1 nửa bên phải (giữ nguyên cho các loại khác)
    const perSide = Math.ceil(capacity / 2);
    for (let i = 0; i < perSide; i++) {
      // Bên trái
      chairs.push(
        <div
          key={`left-${i}`}
          className={`absolute left-[-16px] top-[${8 + (i * 32) / perSide}rem] w-4 h-4 rounded-full ${chairColor} opacity-80 border border-white`}
          style={{ top: `${16 + (i * 40) / perSide}%` }}
        />,
      );
      // Bên phải
      if (i < capacity - perSide) {
        chairs.push(
          <div
            key={`right-${i}`}
            className={`absolute right-[-16px] top-[${8 + (i * 32) / perSide}rem] w-4 h-4 rounded-full ${chairColor} opacity-80 border border-white`}
            style={{ top: `${16 + (i * 40) / perSide}%` }}
          />,
        );
      }
    }
  } else {
    // Xếp đều quanh bàn (theo góc tròn)
    const radius = 32;
    for (let i = 0; i < capacity; i++) {
      const angle = (2 * Math.PI * i) / capacity;
      const xPos = Math.round(Math.cos(angle) * radius);
      const yPos = Math.round(Math.sin(angle) * radius);
      chairs.push(
        <div
          key={i}
          className={`absolute w-4 h-4 rounded-full ${chairColor} opacity-80 border border-white`}
          style={{
            left: `calc(50% + ${xPos}px - 8px)`,
            top: `calc(50% + ${yPos}px - 8px)`,
          }}
        />,
      );
    }
  }

  return (
    <div
      className={`relative flex items-center justify-center m-2 ${sizeClass} ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      style={{
        minWidth: 60,
        position: x !== undefined && y !== undefined ? 'absolute' : undefined,
        left: x,
        top: y,
      }}
      onClick={disabled ? undefined : onClick}
    >
      {/* Ghế */}
      {chairs}
      {/* Bàn */}
      <div
        className={`absolute w-full h-full rounded-lg bg-white bg-opacity-10 flex items-center justify-center border-2 ${borderColor} opacity-60 z-10`}
        style={{ pointerEvents: 'none' }}
      >
        <span className="font-bold text-lg text-white drop-shadow z-20">
          {name}
        </span>
      </div>
    </div>
  );
};

export default TableItem;
