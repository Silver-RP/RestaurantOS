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
    // Nếu là VIP, chỉ cho chọn 1 bàn
    if (table.type === 'vip') {
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
          table_type: table._id ?? table.code,
          seatingName: table.code,
          tableCategory: table.type,
        }));
      }
      return;
    }
    // Nếu đã chọn bàn VIP, không cho chọn thêm
    if (selectedTables.length === 1 && selectedTables[0].type === 'vip') return;
    // Nếu chưa chọn bàn nào, hoặc cùng loại
    if (selectedTables.length === 0 || selectedTables[0].type === table.type) {
      // Nếu đã chọn, thì bỏ chọn
      const exists = selectedTables.find(
        (t) => (t._id ?? t.code) === (table._id ?? table.code),
      );
      if (exists) {
        const newSelected = selectedTables.filter(
          (t) => (t._id ?? t.code) !== (table._id ?? table.code),
        );
        setSelectedTables(newSelected);
        // Nếu còn bàn, cập nhật formData với bàn đầu tiên, nếu không thì clear
        if (newSelected.length > 0) {
          setFormData((prev) => ({
            ...prev,
            table_type: newSelected.map((t) => t._id ?? t.code).join(','),
            seatingName: newSelected.map((t) => t.code).join(', '),
            tableCategory: newSelected[0].type, // Lưu loại bàn của bàn đầu tiên
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            table_type: '',
            seatingName: '',
            tableCategory: '',
          }));
        }
      } else {
        // Thêm bàn mới
        const newSelected = [...selectedTables, table];
        setSelectedTables(newSelected);
        setFormData((prev) => ({
          ...prev,
          table_type: newSelected.map((t) => t._id ?? t.code).join(','),
          seatingName: newSelected.map((t) => t.code).join(', '),
          tableCategory: newSelected[0].type, // Lưu loại bàn của bàn đầu tiên
        }));
      }
    }
  };

  const handleNextClick = () => {
    if (!selectedTables.length) {
      setShowWarningModal(true);
      return;
    }
    // Nếu là VIP, chỉ cần 1 bàn
    if (selectedTables.length === 1 && selectedTables[0].type === 'vip') {
      onNext();
      return;
    }
    // Tổng sức chứa các bàn đã chọn
    const totalCapacity = selectedTables.reduce(
      (sum, t) => sum + t.capacity,
      0,
    );
    // Số người cần phục vụ
    const people = formData.number_of_people || 1;
    // Nếu chưa đủ chỗ
    if (totalCapacity < people) {
      setShowCapacityWarningModal(true);
      return;
    }
    // Nếu chọn quá nhiều bàn dư thừa (ví dụ 3 bàn 8 cho 12 người)
    // Chỉ cho phép tổng capacity không vượt quá số người + capacity của 1 bàn (tức là chỉ dư tối đa 1 bàn)
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

  return (
    <div className="max-w-4xl mx-auto text-white font-serif">
      <div className="bg-[#112233] border border-[#F9D783] rounded-xl p-6 pt-0">
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
              const isSelected = selectedTables.some(
                (sel) => (sel._id ?? sel.code) === tableId,
              );
              // Nếu đã chọn bàn VIP, disable các bàn khác
              const hasVip = selectedTables.some((sel) => sel.type === 'vip');
              // Nếu đã chọn bàn thường, chỉ cho chọn cùng loại
              const selectedType = selectedTables[0]?.type;
              let isAvailable = !!t.isAvailable;
              if (hasVip) {
                isAvailable = t.type === 'vip' && isAvailable;
              } else if (selectedTables.length > 0) {
                isAvailable = t.type === selectedType && isAvailable;
              }
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
                      isSelected
                        ? 'selected'
                        : isAvailable
                          ? 'available'
                          : 'reserved'
                    }
                    onClick={() =>
                      handleSelect(tableId, t.code, isAvailable, t)
                    }
                    capacity={t.capacity}
                    disabled={!isAvailable && !isSelected}
                  />
                </div>
              );
            })}
        </div>
        {/* Legend giữ nguyên */}
        <div className="flex gap-6 justify-center mt-4 text-white">
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
          <div className="flex justify-center items-center">
            <ButtonComponents
              variant="filled"
              size="small"
              className="font-bold"
              onClick={() => setShowTypeInfo(true)}
            >
              Xem chi tiết các loại bàn
            </ButtonComponents>
          </div>
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
