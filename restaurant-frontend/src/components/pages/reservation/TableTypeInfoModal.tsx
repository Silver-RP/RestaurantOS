import React, { useState } from 'react';
import GlobalModal from '@components/common/GlobalModal';
import { FaUsers } from 'react-icons/fa';

interface TableTypeInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

const TableTypeInfoModal: React.FC<TableTypeInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedTableType, setSelectedTableType] = useState<string>('quiet');

  if (!isOpen) return null;

  return (
    <GlobalModal>
      <div className="relative bg-headerBackground border-2 border-[#F9D783] rounded-2xl shadow-2xl w-full max-w-6xl p-0 overflow-hidden">
        <button
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-[#F9D783] text-[#1a2233] text-2xl font-bold shadow cursor-pointer transition z-10"
          onClick={onClose}
          aria-label="Đóng"
        >
          ×
        </button>

        <div className="flex flex-col lg:flex-row h-[80vh] max-h-[600px]">
          {/* Sidebar */}
          <div className="w-full lg:w-64 bg-headerBackground border-r border-[#F9D783] p-4">
            <h3 className="text-[#F9D783] font-bold text-lg mb-4 text-center">
              Loại bàn
            </h3>
            <div className="space-y-2">
              {['quiet', 'standard', 'group', 'vip'].map((type) => {
                const info = TABLE_TYPE_INFO[type];
                const isActive = selectedTableType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedTableType(type)}
                    className={`
                      w-full p-3 rounded-lg text-left transition-all duration-200 flex items-center gap-3
                      ${
                        isActive
                          ? 'bg-[#F9D783] text-[#1a2233] shadow-lg'
                          : 'bg-bodyBackground text-white hover:bg-[#334455]'
                      }
                    `}
                  >
                    <div
                      className={`
                      w-3 h-3 rounded-full
                      ${type === 'group' ? 'bg-green-400' : ''}
                      ${type === 'standard' ? 'bg-blue-400' : ''}
                      ${type === 'quiet' ? 'bg-purple-400' : ''}
                      ${type === 'vip' ? 'bg-yellow-400' : ''}
                    `}
                    />
                    <span className="font-medium">{info.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {(() => {
              const info = TABLE_TYPE_INFO[selectedTableType];
              return (
                <div className="h-full flex flex-col">
                  <div className="flex-1 flex flex-col gap-4">
                    {/* Image */}
                    <div className="w-full">
                      <img
                        src={`/assets/images/reservation/${info.image}`}
                        alt={info.label}
                        className="w-full h-80 object-cover rounded-2xl shadow-2xl border-2 border-[#F9D783]"
                      />
                    </div>

                    {/* Description */}
                    <div className="flex-1">
                      <div className="bg-headerBackground rounded-2xl p-8 border-2 border-[#F9D783] shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                          <div
                            className={`
                            w-4 h-4 rounded-full
                            ${selectedTableType === 'group' ? 'bg-green-400' : ''}
                            ${selectedTableType === 'standard' ? 'bg-blue-400' : ''}
                            ${selectedTableType === 'quiet' ? 'bg-purple-400' : ''}
                            ${selectedTableType === 'vip' ? 'bg-yellow-400' : ''}
                          `}
                          />
                          <h3 className="text-[#F9D783] font-bold text-2xl">
                            {info.label}
                          </h3>
                          <FaUsers className="w-6 h-6 text-[#F9D783]" />
                          <span className="text-white text-lg font-bold">
                            {selectedTableType === 'group' && '8-10 người'}
                            {selectedTableType === 'standard' && '4 người'}
                            {selectedTableType === 'quiet' && '2 người'}
                            {selectedTableType === 'vip' && '10 - 20 người'}
                          </span>
                        </div>
                        <p className="text-white text-lg leading-relaxed">
                          {info.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </GlobalModal>
  );
};

export default TableTypeInfoModal;
