import React from 'react';
import { useEffect, useState } from 'react';
import { useTables } from '@/hooks/useTables';
import { ITable } from '@/types/Table.type';
import TableItem from './TableItem';
import ButtonComponents from '@components/common/ButtonComponents';
import { ReservationFormData } from '../../../types/reservation.type';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

// type Table = {
//   id: string;
//   name: string;
//   x?: number;
//   y?: number;
//   status: TableStatus;
//   type: TableType;
//   capacity: number;
//   gridCol?: number;
//   gridRow?: number;
//   spanCol?: number;
// };

// const mockTablesFloor1: Table[] = [
//   // Bàn nhóm (A1–A8) -> G1–G8
//   {
//     id: 'A1',
//     name: 'G1',
//     gridCol: 2,
//     gridRow: 2,
//     status: 'available',
//     type: 'group',
//     capacity: 8,
//   },
//   {
//     id: 'A2',
//     name: 'G2',
//     gridCol: 4,
//     gridRow: 2,
//     status: 'available',
//     type: 'group',
//     capacity: 8,
//   },
//   {
//     id: 'A3',
//     name: 'G3',
//     gridCol: 6,
//     gridRow: 2,
//     status: 'available',
//     type: 'group',
//     capacity: 8,
//   },
//   {
//     id: 'A4',
//     name: 'G4',
//     gridCol: 8,
//     gridRow: 2,
//     status: 'available',
//     type: 'group',
//     capacity: 8,
//   },
//   {
//     id: 'A5',
//     name: 'G5',
//     gridCol: 2,
//     gridRow: 3,
//     status: 'available',
//     type: 'group',
//     capacity: 8,
//   },
//   {
//     id: 'A6',
//     name: 'G6',
//     gridCol: 4,
//     gridRow: 3,
//     status: 'available',
//     type: 'group',
//     capacity: 8,
//   },
//   {
//     id: 'A7',
//     name: 'G7',
//     gridCol: 6,
//     gridRow: 3,
//     status: 'available',
//     type: 'group',
//     capacity: 8,
//   },
//   {
//     id: 'A8',
//     name: 'G8',
//     gridCol: 8,
//     gridRow: 3,
//     status: 'available',
//     type: 'group',
//     capacity: 8,
//   },

//   // Bàn thường (B1–B16) -> S1–S16
//   {
//     id: 'B1',
//     name: 'S1',
//     gridCol: 2,
//     gridRow: 4,
//     status: 'available',
//     type: 'standard',
//     capacity: 4,
//   },
//   {
//     id: 'B2',
//     name: 'S2',
//     gridCol: 4,
//     gridRow: 4,
//     status: 'available',
//     type: 'standard',
//     capacity: 4,
//   },
//   {
//     id: 'B3',
//     name: 'S3',
//     gridCol: 6,
//     gridRow: 4,
//     status: 'available',
//     type: 'standard',
//     capacity: 4,
//   },
//   {
//     id: 'B4',
//     name: 'S4',
//     gridCol: 8,
//     gridRow: 4,
//     status: 'available',
//     type: 'standard',
//     capacity: 4,
//   },
//   {
//     id: 'B5',
//     name: 'S5',
//     gridCol: 2,
//     gridRow: 5,
//     status: 'available',
//     type: 'standard',
//     capacity: 4,
//   },
//   {
//     id: 'B6',
//     name: 'S6',
//     gridCol: 4,
//     gridRow: 5,
//     status: 'available',
//     type: 'standard',
//     capacity: 4,
//   },
//   {
//     id: 'B7',
//     name: 'S7',
//     gridCol: 6,
//     gridRow: 5,
//     status: 'available',
//     type: 'standard',
//     capacity: 4,
//   },
//   {
//     id: 'B8',
//     name: 'S8',
//     gridCol: 8,
//     gridRow: 5,
//     status: 'available',
//     type: 'standard',
//     capacity: 4,
//   },
//   {
//     id: 'B9',
//     name: 'S9',
//     gridCol: 2,
//     gridRow: 6,
//     status: 'available',
//     type: 'standard',
//     capacity: 4,
//   },
//   {
//     id: 'B10',
//     name: 'S10',
//     gridCol: 4,
//     gridRow: 6,
//     status: 'available',
//     type: 'standard',
//     capacity: 4,
//   },
//   {
//     id: 'B11',
//     name: 'S11',
//     gridCol: 6,
//     gridRow: 6,
//     status: 'available',
//     type: 'standard',
//     capacity: 4,
//   },
//   {
//     id: 'B12',
//     name: 'S12',
//     gridCol: 8,
//     gridRow: 6,
//     status: 'available',
//     type: 'standard',
//     capacity: 4,
//   },
//   {
//     id: 'B13',
//     name: 'S13',
//     gridCol: 2,
//     gridRow: 7,
//     status: 'available',
//     type: 'standard',
//     capacity: 4,
//   },
//   {
//     id: 'B14',
//     name: 'S14',
//     gridCol: 4,
//     gridRow: 7,
//     status: 'available',
//     type: 'standard',
//     capacity: 4,
//   },
//   {
//     id: 'B15',
//     name: 'S15',
//     gridCol: 6,
//     gridRow: 7,
//     status: 'available',
//     type: 'standard',
//     capacity: 4,
//   },
//   {
//     id: 'B16',
//     name: 'S16',
//     gridCol: 8,
//     gridRow: 7,
//     status: 'available',
//     type: 'standard',
//     capacity: 4,
//   },

//   // Bàn yên tĩnh (Q1–Q12) giữ nguyên
//   {
//     id: 'Q1',
//     name: 'Q1',
//     gridCol: 10,
//     gridRow: 2,
//     status: 'available',
//     type: 'quiet',
//     capacity: 2,
//   },
//   {
//     id: 'Q2',
//     name: 'Q2',
//     gridCol: 10,
//     gridRow: 3,
//     status: 'available',
//     type: 'quiet',
//     capacity: 2,
//   },
//   {
//     id: 'Q3',
//     name: 'Q3',
//     gridCol: 10,
//     gridRow: 4,
//     status: 'available',
//     type: 'quiet',
//     capacity: 2,
//   },
//   {
//     id: 'Q4',
//     name: 'Q4',
//     gridCol: 10,
//     gridRow: 5,
//     status: 'available',
//     type: 'quiet',
//     capacity: 2,
//   },
//   {
//     id: 'Q5',
//     name: 'Q5',
//     gridCol: 10,
//     gridRow: 6,
//     status: 'available',
//     type: 'quiet',
//     capacity: 2,
//   },
//   {
//     id: 'Q6',
//     name: 'Q6',
//     gridCol: 10,
//     gridRow: 7,
//     status: 'available',
//     type: 'quiet',
//     capacity: 2,
//   },
//   {
//     id: 'Q7',
//     name: 'Q7',
//     gridCol: 12,
//     gridRow: 2,
//     status: 'available',
//     type: 'quiet',
//     capacity: 2,
//   },
//   {
//     id: 'Q8',
//     name: 'Q8',
//     gridCol: 12,
//     gridRow: 3,
//     status: 'available',
//     type: 'quiet',
//     capacity: 2,
//   },
//   {
//     id: 'Q9',
//     name: 'Q9',
//     gridCol: 12,
//     gridRow: 4,
//     status: 'available',
//     type: 'quiet',
//     capacity: 2,
//   },
//   {
//     id: 'Q10',
//     name: 'Q10',
//     gridCol: 12,
//     gridRow: 5,
//     status: 'available',
//     type: 'quiet',
//     capacity: 2,
//   },
//   {
//     id: 'Q11',
//     name: 'Q11',
//     gridCol: 12,
//     gridRow: 6,
//     status: 'available',
//     type: 'quiet',
//     capacity: 2,
//   },
//   {
//     id: 'Q12',
//     name: 'Q12',
//     gridCol: 12,
//     gridRow: 7,
//     status: 'available',
//     type: 'quiet',
//     capacity: 2,
//   },
//   // Bàn VIP (V1–V4) giữ nguyên
//   // {
//   //   id: 'V1',
//   //   name: 'V1',
//   //   gridCol: 10,
//   //   gridRow: 2,
//   //   status: 'available',
//   //   type: 'vip',
//   //   capacity: 10,
//   // },
//   // {
//   //   id: 'V2',
//   //   name: 'V2',
//   //   gridCol: 12,
//   //   gridRow: 2,
//   //   status: 'available',
//   //   type: 'vip',
//   //   capacity: 10,
//   // },
//   // {
//   //   id: 'V3',
//   //   name: 'V3',
//   //   gridCol: 10,
//   //   gridRow: 3,
//   //   status: 'available',
//   //   type: 'vip',
//   //   capacity: 10,
//   // },
//   // {
//   //   id: 'V4',
//   //   name: 'V4',
//   //   gridCol: 12,
//   //   gridRow: 3,
//   //   status: 'available',
//   //   type: 'vip',
//   //   capacity: 10,
//   // },
//   // Thêm lại bàn VIP ở cuối, chọn vị trí gridRow 8, gridCol 2, 5, 8, 11 (giãn đều cuối sơ đồ)
//   {
//     id: 'V1',
//     name: 'V1',
//     gridCol: 4,
//     gridRow: 8,
//     status: 'available',
//     type: 'vip',
//     capacity: 10,
//   },
//   {
//     id: 'V2',
//     name: 'V2',
//     gridCol: 6,
//     gridRow: 8,
//     status: 'available',
//     type: 'vip',
//     capacity: 10,
//   },
//   {
//     id: 'V3',
//     name: 'V3',
//     gridCol: 8,
//     gridRow: 8,
//     status: 'available',
//     type: 'vip',
//     capacity: 10,
//   },
//   {
//     id: 'V4',
//     name: 'V4',
//     gridCol: 10,
//     gridRow: 8,
//     status: 'available',
//     type: 'vip',
//     capacity: 10,
//   },
// ];

// Tạm thời comment phần tầng 2
// const mockTablesFloor2: Table[] = [
//   // Sân khấu
//   {
//     id: 'STAGE2',
//     name: 'SÂN KHẤU',
//     status: 'available',
//     type: 'stage',
//     capacity: 0,
//     gridCol: 4,
//     gridRow: 1,
//   },

//   // Hàng 1 - Bàn lớn (C1–C3) - vòng cung gần sân khấu
//   {
//     id: 'C1',
//     name: 'C1',
//     status: 'available',
//     type: 'group',
//     capacity: 8,
//     gridCol: 2,
//     gridRow: 2,
//   },
//   {
//     id: 'C2',
//     name: 'C2',
//     status: 'available',
//     type: 'group',
//     capacity: 8,
//     gridCol: 4,
//     gridRow: 3,
//   },
//   {
//     id: 'C3',
//     name: 'C3',
//     status: 'available',
//     type: 'group',
//     capacity: 8,
//     gridCol: 6,
//     gridRow: 2,
//   },

//   // Hàng 2 - Bàn tiêu chuẩn (C4–C7) - vòng cung mở rộng
//   {
//     id: 'C4',
//     name: 'C4',
//     status: 'available',
//     type: 'standard',
//     capacity: 4,
//     gridCol: 1,
//     gridRow: 3,
//   },
//   {
//     id: 'C5',
//     name: 'C5',
//     status: 'available',
//     type: 'standard',
//     capacity: 4,
//     gridCol: 3,
//     gridRow: 4,
//   },
//   {
//     id: 'C6',
//     name: 'C6',
//     status: 'available',
//     type: 'standard',
//     capacity: 4,
//     gridCol: 5,
//     gridRow: 4,
//   },
//   {
//     id: 'C7',
//     name: 'C7',
//     status: 'available',
//     type: 'standard',
//     capacity: 4,
//     gridCol: 7,
//     gridRow: 3,
//   },

//   // Hàng 3 - Quiet zone (Q1–Q7) - vòng cung thấp nhất
//   {
//     id: 'Q1-2F',
//     name: 'Q1',
//     status: 'available',
//     type: 'quiet',
//     capacity: 2,
//     gridCol: 1,
//     gridRow: 5,
//   },
//   {
//     id: 'Q2-2F',
//     name: 'Q2',
//     status: 'available',
//     type: 'quiet',
//     capacity: 2,
//     gridCol: 2,
//     gridRow: 6,
//   },
//   {
//     id: 'Q3-2F',
//     name: 'Q3',
//     status: 'available',
//     type: 'quiet',
//     capacity: 2,
//     gridCol: 3,
//     gridRow: 6,
//   },
//   {
//     id: 'Q4-2F',
//     name: 'Q4',
//     status: 'available',
//     type: 'quiet',
//     capacity: 2,
//     gridCol: 4,
//     gridRow: 7,
//   },
//   {
//     id: 'Q5-2F',
//     name: 'Q5',
//     status: 'available',
//     type: 'quiet',
//     capacity: 2,
//     gridCol: 5,
//     gridRow: 6,
//   },
//   {
//     id: 'Q6-2F',
//     name: 'Q6',
//     status: 'available',
//     type: 'quiet',
//     capacity: 2,
//     gridCol: 6,
//     gridRow: 6,
//   },
//   {
//     id: 'Q7-2F',
//     name: 'Q7',
//     status: 'available',
//     type: 'quiet',
//     capacity: 2,
//     gridCol: 7,
//     gridRow: 5,
//   },
// ];

interface Step2SeatingProps {
  formData: ReservationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ReservationFormData>>;
  onNext: () => void;
  onBack: () => void;
}

const Step2Seating: React.FC<Step2SeatingProps> = ({
  formData,
  setFormData,
  onNext,
  onBack,
}) => {
  // const [floor, setFloor] = React.useState(1); // Ẩn chuyển tầng

  const { getAllTables } = useTables();
  const [tables, setTables] = useState<ITable[]>([]);

  useEffect(() => {
    const fetchTables = async () => {
      const res = await getAllTables();
      if (Array.isArray(res)) {
        setTables(res);
      }
    };
    fetchTables();
  }, [getAllTables]);

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
    <div className="max-w-4xl mx-auto text-white py-8 px-4 font-serif">
      {/* Ẩn nút chuyển tầng */}
      {/* <div className="flex justify-center mb-4 gap-2">
        <button
          className={`px-4 py-2 rounded ${floor === 1 ? 'bg-[#F9D783] text-black' : 'bg-[#112233] text-[#F9D783] border border-[#F9D783]'}`}
          onClick={() => setFloor(1)}
        >
          Tầng 1
        </button>
        <button
          className={`px-4 py-2 rounded ${floor === 2 ? 'bg-[#F9D783] text-black' : 'bg-[#112233] text-[#F9D783] border border-[#F9D783]'}`}
          onClick={() => setFloor(2)}
        >
          Tầng 2
        </button>
      </div> */}
      <div className="bg-[#112233] border border-[#F9D783] rounded-xl p-6">
        {/* Luôn hiển thị tầng 1 */}
        <div
          className="grid relative mx-auto"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridTemplateRows: 'repeat(8, 1fr)',
            gap: '20px',
            width: '100%',
            height: 600,
            position: 'relative',
          }}
        >
          {tables
            .filter(
              (t) =>
                typeof t.position?.x === 'number' &&
                typeof t.position?.y === 'number',
            )
            .map((t) => {
              const tableId = t._id ?? t.code;
              const isGroupOrVip = t.type === 'group' || t.type === 'vip';
              return (
                <div
                  key={tableId}
                  style={{
                    gridColumn: `${t.position.x} / span ${isGroupOrVip ? 2 : 1}`,
                    gridRow: t.position.y,
                    justifySelf: 'center',
                    alignSelf: 'center',
                  }}
                >
                  <TableItem
                    id={tableId}
                    name={t.code}
                    type={t.type}
                    status={
                      formData.table_type === tableId
                        ? 'selected'
                        : t.isAvailable
                          ? 'available'
                          : 'reserved'
                    }
                    onClick={() => handleSelect(tableId, t.code)}
                    capacity={t.capacity}
                  />
                </div>
              );
            })}
        </div>
        {/* Legend giữ nguyên */}
        <div className="flex gap-6 justify-center mt-8 text-white">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-[#1abc9c] border-2 border-[#F9D783] inline-block" />
            <span>Trống</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-[#e74c3c] border-2 border-[#F9D783] inline-block" />
            <span>Đã đặt</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-[#F9D783] border-2 border-[#F9D783] inline-block" />
            <span>Đang chọn</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-[#1abc9c] border-2 border-blue-400 inline-block" />
            <span>Khu yên tĩnh</span>
          </div>
        </div>
      </div>
      {/* Nút điều hướng */}
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
