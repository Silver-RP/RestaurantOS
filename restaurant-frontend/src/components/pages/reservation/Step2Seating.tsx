import React from 'react';
import ButtonComponents from '@components/common/ButtonComponents';
import { ReservationFormData } from '../../../types/Reservation.type';
import GlobalModal from '@components/common/GlobalModal';
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

  const TABLE_TYPE_INFO: Record<
    string,
    { image: string; label: string; desc: string }
  > = {
    group: {
      image: 'table-group.jpeg',
      label: 'Bàn nhóm',
      desc: 'Bàn nhóm phù hợp cho các buổi họp mặt, sinh nhật, liên hoan hoặc nhóm bạn đông người. Không gian rộng rãi, vị trí thuận tiện cho việc trò chuyện và giao lưu. Được bố trí ở khu vực trung tâm, dễ dàng gọi phục vụ và di chuyển.',
    },
    standard: {
      image: 'table-standard.jpg',
      label: 'Bàn thường',
      desc: 'Bàn tiêu chuẩn dành cho gia đình nhỏ hoặc nhóm bạn từ 2-4 người. Vị trí linh hoạt, gần khu vực phục vụ chính, phù hợp cho bữa ăn thân mật hoặc dùng bữa hàng ngày. Không gian thoải mái, dễ quan sát toàn cảnh nhà hàng.',
    },
    quiet: {
      image: 'table-quiet.jpg',
      label: 'Bàn yên tĩnh',
      desc: 'Bàn yên tĩnh được bố trí ở góc riêng tư, ít tiếng ồn, lý tưởng cho các buổi gặp gỡ cần không gian riêng, trao đổi công việc hoặc hẹn hò. Trang trí nhẹ nhàng, ánh sáng dịu, tạo cảm giác thư giãn.',
    },
    vip: {
      image: 'image.png',
      label: 'Bàn VIP',
      desc: 'Bàn VIP nằm ở khu vực sang trọng, riêng biệt, có rèm che hoặc vách ngăn. Phù hợp tiếp khách quan trọng, tổ chức tiệc nhỏ hoặc kỷ niệm đặc biệt. Dịch vụ ưu tiên, không gian đẳng cấp, trang trí tinh tế.',
    },
  };

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
        setFormData((prev) => ({ ...prev, table_type: '', seatingName: '' }));
      } else {
        setSelectedTables([table]);
        setFormData((prev) => ({
          ...prev,
          table_type: table._id ?? table.code,
          seatingName: table.code,
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
          }));
        } else {
          setFormData((prev) => ({ ...prev, table_type: '', seatingName: '' }));
        }
      } else {
        // Thêm bàn mới
        const newSelected = [...selectedTables, table];
        setSelectedTables(newSelected);
        setFormData((prev) => ({
          ...prev,
          table_type: newSelected.map((t) => t._id ?? t.code).join(','),
          seatingName: newSelected.map((t) => t.code).join(', '),
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
        {showTypeInfo && (
          <GlobalModal>
            <div className="relative bg-[#1a2233] border-2 border-[#F9D783] rounded-2xl shadow-2xl w-full max-w-5xl p-0 overflow-hidden">
              <button
                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-[#F9D783] text-[#1a2233] text-2xl font-bold shadow cursor-pointer transition z-10"
                onClick={() => setShowTypeInfo(false)}
                aria-label="Đóng"
              >
                ×
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-8">
                {['quiet', 'standard', 'group', 'vip'].map((type) => {
                  const info = TABLE_TYPE_INFO[type];
                  return (
                    <div
                      key={type}
                      className={`
                        bg-[#223344] rounded-2xl flex flex-col items-center border-2 shadow-lg transition
                        ${type === 'group' ? 'border-green-400' : ''}
                        ${type === 'standard' ? 'border-blue-400' : ''}
                        ${type === 'quiet' ? 'border-purple-400' : ''}
                        ${type === 'vip' ? 'border-yellow-400' : ''}
                        min-h-[320px]
                      `}
                    >
                      <img
                        src={`/assets/images/reservation/${info.image}`}
                        alt={info.label}
                        className="w-full h-56 object-cover rounded-xl shadow mb-3"
                        style={{ maxWidth: '100%' }}
                      />
                      <div className="text-[#F9D783] font-extrabold text-xl tracking-wide text-center drop-shadow">
                        {info.label}
                      </div>
                      <div className="flex items-center gap-2 mb-2 justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="#F9D783"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118A7.5 7.5 0 0112 17.25c2.042 0 3.899.763 5.318 2.018M18.75 6c0 2.485-2.014 4.5-4.5 4.5S9.75 8.485 9.75 6"
                          />
                        </svg>
                        <span className="text-white text-xs">
                          {type === 'group' && '8-10 người'}
                          {type === 'standard' && '4 người'}
                          {type === 'quiet' && '2 người'}
                          {type === 'vip' && '10 người'}
                        </span>
                      </div>
                      <div className="text-white text-sm text-center leading-relaxed line-clamp-5">
                        {info.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlobalModal>
        )}
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
