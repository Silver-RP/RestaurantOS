import React, { useEffect, useState } from 'react';
import { getLoyaltyAccountInfo, getActiveTiers, getActiveMilestoneDefinitions } from '@/api/LoyaltyApi';
import { saveVoucherForUser } from '@/api/VoucherApi';
import { LoyaltyAccountInfo, LoyaltyTier, MilestoneDefinition } from '@/types/Loyalty.type';
import { FaGift } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useUserVouchers } from '@/hooks/useVouchers';

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
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [milestones, setMilestones] = useState<MilestoneDefinition[]>([]);
  const { data: userVouchers = [], refetch: refetchUserVouchers } = useUserVouchers();
  const [milestoneLoading, setMilestoneLoading] = useState(false);
  const [milestoneError, setMilestoneError] = useState('');
  const [savingVoucherId, setSavingVoucherId] = useState<string | null>(null);

  const fetchMilestonesAndVouchers = async () => {
    setMilestoneLoading(true);
    setMilestoneError('');
    try {
      const milestonesRes = await getActiveMilestoneDefinitions();
      setMilestones(milestonesRes);
    } catch {
      setMilestoneError('Không thể tải mốc quà tặng hoặc voucher của bạn!');
    } finally {
      setMilestoneLoading(false);
    }
  };

  const handleOpenMilestoneModal = () => {
    setShowMilestoneModal(true);
    fetchMilestonesAndVouchers();
  };

  const handleSaveVoucher = async (voucherId: string) => {
    setSavingVoucherId(voucherId);
    try {
      await saveVoucherForUser(voucherId);
      toast.success('Lưu mã thành công!');
      await refetchUserVouchers();
      await fetchMilestonesAndVouchers();
    } catch {
      alert('Lưu mã thất bại!');
    } finally {
      setSavingVoucherId(null);
    }
  };

  useEffect(() => {
    Promise.all([
      getLoyaltyAccountInfo(),
      getActiveTiers(),
      getActiveMilestoneDefinitions()
    ])
      .then(([info, tiers, milestones]) => {
        setInfo(info);
        setTiers(tiers.sort((a: LoyaltyTier, b: LoyaltyTier) => a.min_spent - b.min_spent));
        setMilestones(milestones);
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
        <div>
          {milestones.length > 0 && (
            <FaGift className="text-yellow-400 cursor-pointer text-4xl" title="Xem mốc quà tặng" onClick={handleOpenMilestoneModal} />
          )}
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
      {/* Modal mốc quà tặng */}
      {showMilestoneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-bodyBackground rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowMilestoneModal(false)}>&times;</button>
            <h4 className="text-lg font-bold mb-4 text-secondaryColor">Các mốc quà tặng</h4>
            {milestoneLoading ? (
              <div>Đang tải...</div>
            ) : milestoneError ? (
              <div className="text-red-500">{milestoneError}</div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {milestones.map(milestone => {
                  const enough = currentSpent >= milestone.milestone_amount;
                  const getId = (id: unknown): string => {
                    if (!id) return '';
                    if (typeof id === 'string') return id;
                    if (typeof id === 'object' && id !== null && '_id' in id) return (id as { _id: string })._id;
                    return '';
                  };
                  const voucherId = getId(milestone.voucher_id);
                    const userVoucherIds = userVouchers.map(v => v._id ? v._id.toString() : '');
                  const alreadySaved = userVoucherIds.includes(voucherId);
                  return (
                    <div key={milestone._id} className="border border-secondaryColor rounded p-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-secondaryColor">{milestone.milestone_name}</div>
                        <div className="text-xs text-white">Chi tiêu từ: {milestone.milestone_amount.toLocaleString()}đ</div>
                        <div className="text-xs text-white">
                          Voucher: <span className="font-mono text-secondaryColor">
                            {milestone.voucher_id && typeof milestone.voucher_id === 'object' && 'code' in milestone.voucher_id
                              ? (milestone.voucher_id as { code: string }).code
                              : ''}
                          </span>
                        </div>
                        {milestone.description && <div className="text-xs text-gray-400 mt-1">{milestone.description}</div>}
                      </div>
                      <div className="flex flex-col items-end gap-2 min-w-[120px]">
                        {alreadySaved ? (
                          <button className="px-3 py-1 rounded bg-gray-300 text-gray-600 cursor-not-allowed" disabled>Đã lưu</button>
                        ) : enough ? (
                          <button
                            className="px-3 py-1 rounded bg-secondaryColor text-black font-semibold border-2 border-transparent transition-colors duration-150 hover:bg-transparent hover:text-secondaryColor hover:border-secondaryColor disabled:opacity-60"
                            disabled={savingVoucherId === voucherId}
                            onClick={() => handleSaveVoucher(voucherId)}
                          >
                            {savingVoucherId === voucherId ? 'Đang lưu...' : 'Lưu mã'}
                          </button>
                        ) : (
                          <button className="px-3 py-1 rounded bg-gray-200 text-gray-400 cursor-not-allowed" disabled>Chưa đủ điều kiện</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLoyaltyTier; 