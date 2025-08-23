import React from 'react';
import { useEffect, useState } from 'react';
import { useTables } from '@/hooks/useTables';
import { ITable } from '@/types/Table.type';
import TableItem from './TableItem';
import ButtonComponents from '@components/common/ButtonComponents';
import { ReservationFormData } from '../../../types/Reservation.type';
import GlobalModal from '@components/common/GlobalModal';
import TableTypeInfoModal from './TableTypeInfoModal';
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
  const { getAllTables, getTablesByDateTime } = useTables();
  const [tables, setTables] = useState<ITable[]>([]);
  const [selectedTables, setSelectedTables] = useState<ITable[]>([]);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showCapacityWarningModal, setShowCapacityWarningModal] =
    useState(false);
  const [showTypeInfo, setShowTypeInfo] = useState(false);

  useEffect(() => {
    const fetchTables = async () => {
      let res;

      if (formData.date && formData.time) {
        res = await getTablesByDateTime(formData.date, formData.time);
      } else {
        res = await getAllTables();
      }

      if (Array.isArray(res)) {
        setTables(res);
      }
    };
    fetchTables();
  }, [getAllTables, getTablesByDateTime, formData.date, formData.time]);

  const handleSelect = (
    id: string,
    name: string,
    isAvailable: boolean,
    table?: ITable,
  ) => {
    if (!isAvailable || !table) return;
    if (selectedTables.length === 1 && selectedTables[0]._id === table._id) {
      setSelectedTables([]);
      setFormData((prev) => ({
        ...prev,
        table_type: '',
        seatingName: '',
        tableCategory: '',
      }));
    } else {
      setSelectedTables([table]);
      setFormData((prev) => ({
        ...prev,
        table_type: table.code,
        seatingName: table.code,
        tableCategory: table.type,
      }));
    }
  };

  const handleNextClick = () => {
    if (!selectedTables.length) {
      setShowWarningModal(true);
      return;
    }
    if (selectedTables.length === 1 && selectedTables[0].type === 'vip') {
      onNext();
      return;
    }
    const totalCapacity = selectedTables.reduce(
      (sum, t) => sum + t.capacity,
      0,
    );
    const people = formData.number_of_people || 1;
    if (totalCapacity < people) {
      setShowCapacityWarningModal(true);
      return;
    }
    const minCapacity = Math.min(
      ...tables
        .filter((t) => t.type === selectedTables[0].type)
        .map((t) => t.capacity),
    );
    if (totalCapacity > people + minCapacity) {
      setShowCapacityWarningModal(true);
      return;
    }
    onNext();
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="max-w-4xl mx-auto text-white font-serif">
      <div className="bg-[#112233] border border-[#F9D783] rounded-xl p-6">
        <div className="overflow-x-auto w-full hide-scrollbar">
          <div
            className="grid relative mx-auto h-[450px] sm:h-[600px]"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(11, 1fr)',
              gridTemplateRows: 'repeat(7, 1fr)',
              gap: '4px',
              width: '100%',
              position: 'relative',
            }}
          >
            {tables
              .filter(
                (t) =>
                  typeof t.position?.x === 'number' &&
                  typeof t.position?.y === 'number' &&
                  t.position.x > 1 &&
                  t.position.y > 1,
              )
              .map((t) => {
                const tableId = t._id ?? t.code;
                const isGroupOrVip = t.type === 'group' || t.type === 'vip';
                const isSelected = selectedTables.some(
                  (sel) => (sel._id ?? sel.code) === tableId,
                );
                const adjustedX = t.position.x - 1;
                const adjustedY = t.position.y - 1;

                const isCapacityNotEnough =
                  t.type === 'vip'
                    ? false
                    : t.type === 'group'
                      ? (formData.number_of_people || 1) > 10
                      : t.capacity < (formData.number_of_people || 1);
                let isAvailable = !!t.isAvailable;
                if (t.isBooked) {
                  isAvailable = false;
                }
                if (t.type === 'group' && formData.number_of_people === 2) {
                  isAvailable = false;
                }
                if (t.capacity === 2 && formData.number_of_people >= 4) {
                  isAvailable = false;
                }
                if (isCapacityNotEnough) {
                  isAvailable = false;
                }
                let status: 'selected' | 'available' | 'reserved' | 'booked' =
                  'available';
                if (isCapacityNotEnough) {
                  status = 'reserved';
                } else if (isSelected) {
                  status = 'selected';
                } else if (t.isBooked) {
                  status = 'booked';
                } else if (!isAvailable) {
                  status = 'reserved';
                }
                return (
                  <div
                    key={tableId}
                    style={{
                      gridColumn: `${adjustedX} / span ${isGroupOrVip ? 2 : 1}`,
                      gridRow: adjustedY,
                      justifySelf: 'center',
                      alignSelf: 'center',
                    }}
                  >
                    <TableItem
                      id={tableId}
                      name={t.code}
                      type={t.type}
                      status={status}
                      onClick={() => {
                        if (isCapacityNotEnough) {
                          setShowCapacityWarningModal(true);
                          return;
                        }
                        handleSelect(tableId, t.code, isAvailable, t);
                      }}
                      capacity={t.capacity}
                      disabled={!isAvailable && !isSelected}
                    />
                  </div>
                );
              })}
          </div>
        </div>
        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 mt-4 w-full md:w-80% mx-auto text-sm sm:text-base text-white">
          <div className="flex items-center justify-center gap-2">
            <span className="w-6 h-6 rounded bg-[#F9D783] border-2 border-[#F9D783] inline-block" />
            <span>Đang chọn</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-6 h-6 rounded bg-[#1abc9c] border-2 border-[#F9D783] inline-block" />
            <span>Trống</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-6 h-6 rounded bg-[#e74c3c] border-2 border-[#F9D783] inline-block" />
            <span>Đã đặt trước</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-6 h-6 rounded bg-[#3E4B5B] border-2 border-[#F9D783] inline-block" />
            <span>Không khả dụng</span>
          </div>
        </div>
        <div className="flex justify-center items-center w-full mt-4">
          <ButtonComponents
            variant="filled"
            size="small"
            className="font-bold"
            onClick={() => setShowTypeInfo(true)}
          >
            Xem chi tiết các loại bàn
          </ButtonComponents>
        </div>
        <TableTypeInfoModal
          isOpen={showTypeInfo}
          onClose={() => setShowTypeInfo(false)}
        />
      </div>
      {/* Modal cảnh báo khi chưa chọn bàn */}
      {showWarningModal && (
        <GlobalModal>
          <div className="relative bg-headerBackground border-2 border-[#F9D783] rounded-2xl shadow-2xl w-full max-w-2xl p-0 overflow-hidden">
            {/* Nút đóng góc */}
            <button
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-[#F9D783] text-[#1a2233] text-2xl font-bold shadow cursor-pointer transition z-10"
              onClick={() => setShowWarningModal(false)}
              aria-label="Đóng"
            >
              ×
            </button>

            <div className="px-8 py-6 text-white font-serif text-center">
              <h2 className="text-3xl text-[#F9D783] mb-4 font-serif tracking-wide">
                Thông báo
              </h2>
              <p className="text-lg mb-6">
                Vui lòng chọn vị trí ngồi trước khi tiếp tục.
              </p>
              <div className="flex justify-center mt-8">
                <ButtonComponents
                  variant="filled"
                  size="large"
                  className="w-40"
                  onClick={() => setShowWarningModal(false)}
                >
                  OK
                </ButtonComponents>
              </div>
            </div>
          </div>
        </GlobalModal>
      )}
      {/* Modal cảnh báo sức chứa không hợp lệ */}
      {showCapacityWarningModal && (
        <GlobalModal>
          <div className="relative bg-headerBackground border-2 border-[#F9D783] rounded-2xl shadow-2xl w-full max-w-2xl p-0 overflow-hidden">
            <button
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-[#F9D783] text-[#1a2233] text-2xl font-bold shadow cursor-pointer transition z-10"
              onClick={() => setShowCapacityWarningModal(false)}
              aria-label="Đóng"
            >
              ×
            </button>

            <div className="px-8 py-6 text-white font-serif text-center">
              <h2 className="text-3xl text-[#F9D783] mb-4 font-serif tracking-wide">
                Cảnh báo
              </h2>
              <p className="text-lg mb-6">
                Tổng sức chứa các bàn đã chọn không hợp lý với số người. Vui
                lòng chọn số bàn phù hợp hơn.
              </p>
              <div className="flex justify-center mt-8">
                <ButtonComponents
                  variant="filled"
                  size="large"
                  className="w-40"
                  onClick={() => setShowCapacityWarningModal(false)}
                >
                  OK
                </ButtonComponents>
              </div>
            </div>
          </div>
        </GlobalModal>
      )}
      {/* Nút điều hướng */}
      <div className="flex justify-between mt-3 md:mt-10">
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
