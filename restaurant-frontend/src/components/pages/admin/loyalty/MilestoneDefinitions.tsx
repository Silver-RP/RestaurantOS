import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaEye, FaEyeSlash } from 'react-icons/fa';
import { getAllMilestoneDefinitions, createMilestoneDefinition, updateMilestoneDefinition } from '../../../../api/LoyaltyApi';
import { getAllVouchers } from '../../../../api/VoucherApi';
import { MilestoneDefinition } from '../../../../types/Loyalty.type';
import { Voucher } from '../../../../types/Voucher.type';
import Select from 'react-select';
import ConfirmModal from '../../../common/ConfirmModal';

const MilestoneDefinitions: React.FC = () => {
  const [milestones, setMilestones] = useState<MilestoneDefinition[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<MilestoneDefinition | null>(null);
  const [showVoucherWarning, setShowVoucherWarning] = useState(false);
  const [originalVoucherId, setOriginalVoucherId] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ action: string; milestone: MilestoneDefinition | null }>({ action: '', milestone: null });
  const [formData, setFormData] = useState({
    milestone_amount: '',
    milestone_name: '',
    description: '',
    voucher_id: '',
    is_active: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [milestonesData, vouchersData] = await Promise.all([
        getAllMilestoneDefinitions(),
        getAllVouchers({ type: 'gift', limit: 1000 })
      ]);
      setMilestones(milestonesData);
      setVouchers(vouchersData.docs || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Kiểm tra các trường bắt buộc
    if (!formData.milestone_amount || !formData.milestone_name || !formData.voucher_id) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    // Kiểm tra cảnh báo khi thay đổi voucher_id
    if (editingMilestone && formData.voucher_id !== originalVoucherId && !showVoucherWarning) {
      setShowVoucherWarning(true);
      return;
    }
    try {
      const data = {
        milestone_amount: Number(formData.milestone_amount),
        milestone_name: formData.milestone_name,
        description: formData.description,
        voucher_id: formData.voucher_id,
        is_active: formData.is_active
      };
      if (editingMilestone) {
        await updateMilestoneDefinition(editingMilestone._id, data);
        toast.success('Cập nhật mốc quà tặng thành công');
      } else {
        await createMilestoneDefinition(data);
        toast.success('Tạo mốc quà tặng thành công');
      }
      setIsModalOpen(false);
      setEditingMilestone(null);
      setShowVoucherWarning(false);
      resetForm();
      loadData();
    } catch (error: any) {
      let errorMessage = 'Có lỗi xảy ra';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  const handleEdit = (milestone: MilestoneDefinition) => {
    setEditingMilestone(milestone);
    setOriginalVoucherId(milestone.voucher_id);
    setFormData({
      milestone_amount: milestone.milestone_amount.toString(),
      milestone_name: milestone.milestone_name,
      description: milestone.description,
      voucher_id: milestone.voucher_id,
      is_active: milestone.is_active
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (milestone: MilestoneDefinition) => {
    const action = milestone.is_active ? 'ẩn' : 'kích hoạt';
    setConfirmAction({ action, milestone });
    setShowConfirmModal(true);
  };

  const confirmToggleActive = async () => {
    if (!confirmAction.milestone) return;

    try {
      await updateMilestoneDefinition(confirmAction.milestone._id, { is_active: !confirmAction.milestone.is_active });
      toast.success(`${confirmAction.action.charAt(0).toUpperCase() + confirmAction.action.slice(1)} mốc quà tặng thành công`);
      loadData();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      toast.error(errorMessage);
    } finally {
      setShowConfirmModal(false);
      setConfirmAction({ action: '', milestone: null });
    }
  };

  const resetForm = () => {
    setFormData({
      milestone_amount: '',
      milestone_name: '',
      description: '',
      voucher_id: '',
      is_active: true
    });
    setShowVoucherWarning(false);
  };

  // Lấy danh sách voucher đã được gán cho mốc khác (trừ voucher của milestone đang sửa)
  const usedVoucherIds = milestones
    .filter(m => !editingMilestone || m._id !== editingMilestone._id)
    .map(m => typeof m.voucher_id === 'string' ? m.voucher_id : (m.voucher_id && typeof m.voucher_id === 'object' && '_id' in m.voucher_id ? m.voucher_id._id : ''))
    .filter((id): id is string => !!id);
  const voucherOptions = vouchers
    .filter(voucher => !!voucher._id)
    .map(voucher => ({
      value: voucher._id!,
      label: `${voucher.code} - ${voucher.description}`,
      isDisabled: usedVoucherIds.includes(voucher._id!) && (!editingMilestone || voucher._id !== formData.voucher_id)
    }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  // Sắp xếp milestones theo milestone_amount tăng dần
  const sortedMilestones = [...milestones].sort((a, b) => a.milestone_amount - b.milestone_amount);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý Mốc Quà Tặng</h2>
        <button
          onClick={() => {
            setEditingMilestone(null);
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-adminprimary text-white rounded hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Thêm Mốc Mới
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mốc Chi Tiêu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên Mốc
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô Tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Voucher
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
              {sortedMilestones.map((milestone) => (
                <tr key={milestone._id} className={!milestone.is_active ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {milestone.milestone_amount.toLocaleString()}đ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={!milestone.is_active ? 'text-gray-400' : 'text-gray-900'}>
                      {milestone.milestone_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {milestone.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {milestone.voucher && (milestone.voucher as import('../../../../types/Voucher.type').Voucher).code ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        {(milestone.voucher as import('../../../../types/Voucher.type').Voucher).code}
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                        {typeof milestone.voucher_id === 'string'
                          ? milestone.voucher_id
                          : (milestone.voucher_id && (milestone.voucher_id as import('../../../../types/Voucher.type').Voucher).code ? (milestone.voucher_id as import('../../../../types/Voucher.type').Voucher).code : '')}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      milestone.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {milestone.is_active ? 'Hoạt động' : 'Đã ẩn'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(milestone)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      title="Chỉnh sửa"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleToggleActive(milestone)}
                      className={`mr-3 ${milestone.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                      title={milestone.is_active ? 'Ẩn mốc' : 'Kích hoạt mốc'}
                    >
                      {milestone.is_active ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </td>
                </tr>
              ))}
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
                {editingMilestone ? 'Chỉnh sửa Mốc Quà Tặng' : 'Thêm Mốc Quà Tặng Mới'}
              </h3>
              
              {/* Warning Modal for voucher_id change */}
              {showVoucherWarning && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Cảnh báo: Thay đổi voucher
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>Việc thay đổi voucher có thể ảnh hưởng đến các voucher đã phát cho user. Bạn có chắc chắn muốn tiếp tục?</p>
                      </div>
                      <div className="mt-4 flex space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowVoucherWarning(false)}
                          className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium hover:bg-yellow-200"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowVoucherWarning(false);
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
                    Mốc chi tiêu (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={formData.milestone_amount}
                    onChange={(e) => setFormData({...formData, milestone_amount: e.target.value})}
                    className={`mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 ${editingMilestone ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    disabled={!!editingMilestone}
                  />
                  {editingMilestone && (
                    <p className="mt-1 text-xs text-gray-500">
                      Không thể thay đổi mốc chi tiêu sau khi đã tạo
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên mốc
                  </label>
                  <input
                    type="text"
                    value={formData.milestone_name}
                    onChange={(e) => setFormData({...formData, milestone_name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Voucher <span className="text-red-500">*</span>
                    {editingMilestone && (
                      <span className="ml-1 text-yellow-600">⚠️</span>
                    )}
                  </label>
                  <Select
                    options={voucherOptions}
                    value={voucherOptions.find(opt => opt.value === formData.voucher_id)}
                    onChange={(opt) => setFormData({...formData, voucher_id: opt?.value || ''})}
                    placeholder="Chọn voucher..."
                    className="mt-1"
                    isOptionDisabled={(option) => option.isDisabled}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Chỉ voucher có type &quot;gift&quot; mới được hiển thị
                  </p>
                  {editingMilestone && (
                    <p className="mt-1 text-xs text-yellow-600">
                      Thay đổi voucher có thể ảnh hưởng đến dữ liệu đã phát
                    </p>
                  )}
                </div>
                
                {editingMilestone && (
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
                      setEditingMilestone(null);
                      setShowVoucherWarning(false);
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
                    {editingMilestone ? 'Cập nhật' : 'Tạo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && confirmAction.milestone && (
        <ConfirmModal
          title="Xác nhận thay đổi trạng thái"
          description={`Bạn có chắc chắn muốn ${confirmAction.action} mốc "${confirmAction.milestone.milestone_name}"?`}
          onConfirm={confirmToggleActive}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default MilestoneDefinitions; 