import React, { useEffect, useState } from 'react';
import { getAccountInfo, getAllTiers } from '@/api/LoyaltyApi';
import { LoyaltyAccountInfo, LoyaltyTier } from '@/types/Loyalty.type';

// Hàm chuyển tier_name sang tiếng Việt
const getTierNameVN = (tier_name: string) => {
  switch (tier_name) {
    case 'bronze': return 'Đồng';
    case 'silver': return 'Bạc';
    case 'gold': return 'Vàng';
    case 'diamond': return 'Kim cương';
    case 'new': return 'Mới'; 
    default: return tier_name;
  }
};

const UserLoyaltyTier: React.FC = () => {
  const [info, setInfo] = useState<LoyaltyAccountInfo | null>(null);
  const [tiers, setTiers] = useState<LoyaltyTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getAccountInfo(), getAllTiers()])
      .then(([info, tiers]) => {
        setInfo(info);
        setTiers(tiers.sort((a, b) => a.min_spent - b.min_spent));
      })
      .catch(() => setError('Không thể tải thông tin hạng thành viên!'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center text-gray-400 py-4">Đang tải hạng thành viên...</div>;
  if (error) return <div className="text-center text-red-400 py-4">{error}</div>;
  if (!info) return null;

  // Tìm tier hiện tại và tier tiếp theo
  const currentYear = new Date().getFullYear().toString();
  const currentSpent = info.yearly_spending?.[currentYear] ?? 0;
  const currentTierIdx = tiers.findIndex(t => t._id === info.current_tier?._id);
  const nextTier = tiers[currentTierIdx + 1];

  // Tính phần trăm tiến trình đến mốc tiếp theo
  const minSpentCurrent = tiers[currentTierIdx]?.min_spent ?? 0;
  const minSpentNext = nextTier?.min_spent ?? minSpentCurrent + 1;
  const percentToNext = Math.min(
    100,
    ((currentSpent - minSpentCurrent) / (minSpentNext - minSpentCurrent)) * 100
  );
  const progressPercent = ((currentTierIdx + percentToNext / 100) / (tiers.length - 1)) * 100;

  // Layout constants
  const BAR_TOP = 40; // px
  const CONTAINER_HEIGHT = 110; // px

  return (
    <div className="mb-8 p-2">
      <h3 className="text-xl font-semibold text-[#FFDA95] mb-4">Hạng thành viên của bạn</h3> 
      <div className="relative mb-2" style={{ minHeight: CONTAINER_HEIGHT }}>
        {/* Progress bar đặt ở giữa */}
        <div
          className="absolute left-0 right-0"
          style={{ top: BAR_TOP, height: 12, zIndex: 1 }}
        >
          <div className="relative h-3 bg-gray-700 rounded-full w-full">
            <div
              className="absolute h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
              style={{ width: `${progressPercent}%`, zIndex: 2 }}
            />
          </div>
        </div>
        {/* Các mốc: tên hạng, chấm tròn, số tiền */}
        {tiers.map((tier, idx) => {
          const left = (idx / (tiers.length - 1)) * 100;
          return (
            <div
              key={tier._id}
              className="absolute flex flex-col items-center"
              style={{ left: `${left}%`, width: 80, transform: 'translateX(-50%)', zIndex: 2 }}
            >
              {/* Tên hạng */}
              <div className={`text-sm font-bold mb-1 text-center ${idx === currentTierIdx ? 'text-yellow-400' : 'text-gray-300'}`}
                   style={{ minHeight: 20 }}>
                {getTierNameVN(tier.tier_name)}
              </div>
              {/* Chấm tròn */}
              <div
                className={`w-5 h-5 rounded-full border-2 z-10 mx-auto mb-1
                  ${idx < currentTierIdx ? 'bg-yellow-400 border-yellow-400' : idx === currentTierIdx ? 'bg-orange-400 border-yellow-400' : 'bg-gray-400 border-gray-400'}
                `}
                style={{ marginTop: BAR_TOP - 27, marginBottom: 4 }}
              />
              {/* Số tiền */}
              <div className="text-xs text-gray-400 text-center mt-1">
                {tier.min_spent.toLocaleString()}đ
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col lg:flex-row gap-6 mt-4">
        <div>
          <span className="block text-xs text-gray-400">Tổng điểm</span>
          <span className="lg:text-lg text-sm font-bold text-white">{info.total_points ?? 0}</span>
        </div>
        <div>
          <span className="block text-xs text-gray-400">Tổng chi tiêu năm nay</span>
          <span className="lg:text-lg text-sm font-bold text-white">{currentSpent.toLocaleString()} VNĐ</span>
        </div>
        <div>
          <span className="block text-xs text-gray-400">Tổng chi tiêu tích lũy</span>
          <span className="lg:text-lg text-sm font-bold text-white">{info.total_spent?.toLocaleString()} VNĐ</span>
        </div>
        <div>
          <span className="block text-xs text-gray-400">Quyền lợi</span>
          <span className="text-sm text-white">{info.current_tier?.benefits ?? '---'}</span>
        </div>
      </div>
      {/* Tổng chi tiêu từng năm */}
      {info.yearly_spending && (
        <div className="mt-4">
          <span className="block text-xs text-gray-400 mb-1">Tổng chi tiêu từng năm:</span>
          <div className="flex flex-wrap gap-3">
            {Object.entries(info.yearly_spending)
              .sort((a, b) => b[0].localeCompare(a[0]))
              .map(([year, value]) => (
                <div key={year} className="bg-gray-800 rounded px-3 py-1 text-xs text-white">
                  <b>{year}:</b> {value.toLocaleString()} VNĐ
                </div>
              ))}
          </div>
        </div>
      )}
      {nextTier && (
        <div className="mt-2 text-xs text-gray-300">
          Còn {(nextTier.min_spent - currentSpent).toLocaleString()}đ để lên hạng <b>{getTierNameVN(nextTier.tier_name)}</b>
        </div>
      )}
           <div className="mt-2 text-xs text-yellow-300">
        <b>Lưu ý:</b> Mỗi năm, hạng thành viên sẽ được reset lại dựa trên tổng chi tiêu của năm đó. Bạn cần chi tiêu lại để duy trì hoặc nâng hạng.
      </div>
    </div>
  );
};

export default UserLoyaltyTier; 