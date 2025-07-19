import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaEye, FaEyeSlash } from 'react-icons/fa';
import { getAllTiers, createTier, updateTier } from '../../../../api/LoyaltyApi';
import ConfirmModal from '../../../common/ConfirmModal';

interface LoyaltyTier {
  _id: string;
  tier_name: 'new' | 'bronze' | 'silver' | 'gold' | 'diamond';
  min_spent: number;
  discount: number;
  benefits?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

const tierOptions = [
  { value: 'new', label: 'Mới', color: '#6B7280' },
  { value: 'bronze', label: 'Đồng', color: '#CD7F32' },
  { value: 'silver', label: 'Bạc', color: '#C0C0C0' },
  { value: 'gold', label: 'Vàng', color: '#FFD700' },
  { value: 'diamond', label: 'Kim cương', color: '#B9F2FF' },
];

const LoyaltyTiers: React.FC = () => {
  const [tiers, setTiers] = useState<LoyaltyTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<LoyaltyTier | null>(null);
  const [showMinSpentWarning, setShowMinSpentWarning] = useState(false);
  const [originalMinSpent, setOriginalMinSpent] = useState<number>(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ action: string; tier: LoyaltyTier | null }>({ action: '', tier: null });
  const [formData, setFormData] = useState({
    tier_name: 'new' as 'new' | 'bronze' | 'silver' | 'gold' | 'diamond',
    min_spent: '',
    discount: '',
    benefits: '',
    is_active: true
  });

  useEffect(() => {
    loadTiers();
  }, []);

  const loadTiers = async () => {
    try {
      setLoading(true);
      const data = await getAllTiers();
      setTiers(data);
    } catch (error) {
      console.error('Error loading tiers:', error);
      toast.error('Không thể tải danh sách hạng thành viên');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tier_name || !formData.min_spent || !formData.discount) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Kiểm tra cảnh báo khi thay đổi min_spent
    if (editingTier && Number(formData.min_spent) !== originalMinSpent && !showMinSpentWarning) {
      setShowMinSpentWarning(true);
      return;
    }

    try {
      const data = {
        tier_name: formData.tier_name,
        min_spent: Number(formData.min_spent),
        discount: Number(formData.discount),
        benefits: formData.benefits,
        is_active: formData.is_active
      };

      if (editingTier) {
        await updateTier(editingTier._id, data);
        toast.success('Cập nhật hạng thành viên thành công');
      } else {
        await createTier(data);
        toast.success('Tạo hạng thành viên thành công');
      }

      setIsModalOpen(false);
      setEditingTier(null);
      setShowMinSpentWarning(false);
      resetForm();
      loadTiers();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (tier: LoyaltyTier) => {
    setEditingTier(tier);
    setOriginalMinSpent(tier.min_spent);
    setFormData({
      tier_name: tier.tier_name,
      min_spent: tier.min_spent.toString(),
      discount: tier.discount.toString(),
      benefits: tier.benefits || '',
      is_active: tier.is_active ?? true
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (tier: LoyaltyTier) => {
    const action = tier.is_active ? 'ẩn' : 'kích hoạt';
    setConfirmAction({ action, tier });
    setShowConfirmModal(true);
  };

  const confirmToggleActive = async () => {
    if (!confirmAction.tier) return;

    try {
      await updateTier(confirmAction.tier._id, { is_active: !confirmAction.tier.is_active });
      toast.success(`${confirmAction.action.charAt(0).toUpperCase() + confirmAction.action.slice(1)} hạng thành viên thành công`);
      loadTiers();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      toast.error(errorMessage);
    } finally {
      setShowConfirmModal(false);
      setConfirmAction({ action: '', tier: null });
    }
  };

  const resetForm = () => {
    setFormData({
      tier_name: 'new',
      min_spent: '',
      discount: '',
      benefits: '',
      is_active: true
    });
    setShowMinSpentWarning(false);
  };

  const getTierInfo = (tierName: string) => {
    return tierOptions.find(option => option.value === tierName) || tierOptions[0];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  const sortedTiers = [...tiers].sort((a, b) => a.min_spent - b.min_spent);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý Hạng Thành viên</h2>
        <button
          onClick={() => {
            setEditingTier(null);
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-adminprimary text-white rounded hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Thêm Hạng Mới
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hạng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mức Chi Tiêu Tối Thiểu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giảm Giá (%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quyền Lợi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng Thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedTiers.map((tier) => {
                const tierInfo = getTierInfo(tier.tier_name);
                return (
                  <tr key={tier._id} className={!tier.is_active ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: tierInfo.color }}
                        />
                        <span className={`text-sm font-medium ${!tier.is_active ? 'text-gray-400' : 'text-gray-900'}`}>
                          {tierInfo.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tier.min_spent.toLocaleString()}đ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tier.discount}%
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {tier.benefits || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        tier.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tier.is_active ? 'Hoạt động' : 'Đã ẩn'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(tier)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleToggleActive(tier)}
                        className={`mr-3 ${tier.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        title={tier.is_active ? 'Ẩn hạng' : 'Kích hoạt hạng'}
                      >
                        {tier.is_active ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingTier ? 'Chỉnh sửa Hạng Thành viên' : 'Thêm Hạng Thành viên Mới'}
              </h3>
              
              {/* Warning Modal for min_spent change */}
              {showMinSpentWarning && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Cảnh báo: Thay đổi mức chi tiêu
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>Việc thay đổi mức chi tiêu sẽ ảnh hưởng đến việc phân hạng của toàn bộ user. Bạn có chắc chắn muốn tiếp tục?</p>
                      </div>
                      <div className="mt-4 flex space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowMinSpentWarning(false)}
                          className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium hover:bg-yellow-200"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowMinSpentWarning(false);
                            handleSubmit(new Event('submit') as unknown as React.FormEvent);
                          }}
                          className="px-3 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700"
                        >
                          Tiếp tục
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên hạng
                  </label>
                  <select
                    value={formData.tier_name}
                    onChange={(e) => setFormData({...formData, tier_name: e.target.value as 'new' | 'bronze' | 'silver' | 'gold' | 'diamond'})}
                    className={`mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 ${
                      editingTier ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    required
                    disabled={!!editingTier}
                  >
                    {tierOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {editingTier && (
                    <p className="mt-1 text-xs text-gray-500">
                      Không thể thay đổi tên hạng sau khi đã tạo
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mức chi tiêu tối thiểu (VNĐ)
                    {editingTier && (
                      <span className="ml-1 text-yellow-600">⚠️</span>
                    )}
                  </label>
                  <input
                    type="number"
                    value={formData.min_spent}
                    onChange={(e) => setFormData({...formData, min_spent: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                  {editingTier && (
                    <p className="mt-1 text-xs text-yellow-600">
                      Thay đổi sẽ ảnh hưởng đến việc phân hạng của toàn bộ user
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Giảm giá (%)
                  </label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({...formData, discount: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quyền lợi
                  </label>
                  <textarea
                    value={formData.benefits}
                    onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    placeholder="Mô tả quyền lợi của hạng này..."
                  />
                </div>
                
                {editingTier && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                      className="h-4 w-4 text-adminprimary focus:ring-adminprimary border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Hoạt động
                    </label>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingTier(null);
                      setShowMinSpentWarning(false);
                      resetForm();
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Huỷ
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-adminprimary text-white rounded hover:bg-blue-700"
                  >
                    {editingTier ? 'Cập nhật' : 'Tạo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && confirmAction.tier && (
        <ConfirmModal
          title="Xác nhận thay đổi trạng thái"
          description={`Bạn có chắc chắn muốn ${confirmAction.action} hạng "${getTierInfo(confirmAction.tier.tier_name).label}"?`}
          onConfirm={confirmToggleActive}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default LoyaltyTiers; 