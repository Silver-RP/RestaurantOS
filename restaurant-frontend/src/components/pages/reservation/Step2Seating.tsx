import React from 'react';
import ButtonComponents from '@components/common/ButtonComponents';
import { ReservationFormData } from '../../../types/reservation.type';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import TableItem from './TableItem';

interface Step2SeatingProps {
  formData: ReservationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ReservationFormData>>;
  onNext: () => void;
  onBack: () => void;
}

const mockTables = [
  { id: 't1', name: 'Bàn 01', x: 2, y: 1, status: 'available' },
  { id: 't2', name: 'Bàn 02', x: 4, y: 1, status: 'reserved' },
  { id: 't3', name: 'Bàn 03', x: 6, y: 1, status: 'available' },
  { id: 't4', name: 'Bàn 04', x: 2, y: 3, status: 'available' },
  { id: 't5', name: 'Bàn 05', x: 4, y: 3, status: 'available' },
  { id: 't6', name: 'Bàn 06', x: 6, y: 3, status: 'reserved' },
  { id: 't7', name: 'Bàn 07', x: 2, y: 5, status: 'available' },
  { id: 't8', name: 'Bàn 08', x: 4, y: 5, status: 'available' },
  { id: 't9', name: 'Bàn 09', x: 6, y: 5, status: 'available' },
];

// 💡 Điều chỉnh màu sắc, font, border và hiệu ứng khi hover/active
const Step2Seating: React.FC<Step2SeatingProps> = ({
  formData,
  setFormData,
  onNext,
  onBack,
}) => {
  const handleSelect = (id: string, name: string) => {
    setFormData((prev) => ({ ...prev, table_type: id, seatingName: name }));
  };

  const handleNextClick = () => {
    if (!formData.table_type) {
      confirmAlert({
        customUI: ({ onClose }) => (
          <div className="text-yellow-400 bg-[#112233] p-6 rounded-md shadow-xl text-center">
            <h2 className="text-xl mb-4 font-semibold">Thông báo</h2>
            <p>Vui lòng chọn vị trí ngồi trước khi tiếp tục.</p>
            <button
              className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded"
              onClick={onClose}
            >
              OK
            </button>
          </div>
        ),
      });
    } else {
      onNext();
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto text-white py-8 px-4 font-serif">
      <h2 className="text-3xl font-semibold mb-6 text-center text-[#f5d77c] tracking-wide">
        Sơ đồ bàn
      </h2>

      <div
        className="relative bg-[#0f2233] border border-[#334455] rounded-xl p-6"
        style={{ width: '100%', height: 500 }}
      >
        {mockTables.map((table) => (
          <TableItem
            key={table.id}
            id={table.id}
            name={table.name}
            x={table.x}
            y={table.y}
            status={
              formData.table_type === table.id
                ? 'selected'
                : table.status === 'reserved'
                  ? 'reserved'
                  : 'available'
            }
            onSelect={() => handleSelect(table.id, table.name)}
          />
        ))}
      </div>

      <div className="flex justify-between mt-10">
        <ButtonComponents variant="outline" size="small" onClick={onBack}>
          QUAY LẠI
        </ButtonComponents>
        <ButtonComponents
          variant="filled"
          size="small"
          onClick={handleNextClick}
        >
          TIẾP TỤC
        </ButtonComponents>
      </div>
    </div>
  );
};

export default Step2Seating;
