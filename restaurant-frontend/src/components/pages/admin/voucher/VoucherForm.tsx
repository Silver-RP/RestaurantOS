import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Voucher } from '../../../../types/Voucher.type';
import { toast } from 'react-toastify';
import { FaChevronDown } from 'react-icons/fa';
import { getAllUsers } from '../../../../api/UserApi';
import { User } from '../../../../types/User.type';
import Select from 'react-select';

interface VoucherFormProps {
  initialData?: Voucher;
  onSubmit: (data: Partial<Voucher>) => void;
}

const discountTypes = [
  { value: 'percent', label: 'Phần trăm' },
  { value: 'fixed', label: 'Số tiền cố định' },
];

const VoucherForm: React.FC<VoucherFormProps & { onAddUsers?: (userIds: string[]) => void }> = ({
  initialData,
  onSubmit,
  onAddUsers,
}) => {
  const navigate = useNavigate();
  const [code, setCode] = useState(initialData?.code || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [type, setType] = useState(initialData?.type || 'public');
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>(initialData?.discount_type || 'percent');
  const [discountValue, setDiscountValue] = useState<number | ''>(
    initialData?.discount_value || '',
  );
  const [maxDiscountValue, setMaxDiscountValue] = useState<number | ''>(
    initialData?.max_discount_value || '',
  );
  const [minOrderValue, setMinOrderValue] = useState<number | ''>(
    initialData?.min_order_value || '',
  );
  const [quantity, setQuantity] = useState<number | ''>(
    initialData?.quantity || '',
  );
  const [startDate, setStartDate] = useState<string | ''>(
    initialData?.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : '',
  );
  const [endDate, setEndDate] = useState<string | ''>(
    initialData?.end_date ? new Date(initialData.end_date).toISOString().split('T')[0] : '',
  );
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [userOptions, setUserOptions] = useState<User[]>([]);
  const [addUsers, setAddUsers] = useState<string[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (type === 'private') {
      setLoadingUsers(true);
      getAllUsers({ page: 1, limit: 1000 })
        .then(res => setUserOptions(res.users))
        .finally(() => setLoadingUsers(false));
    }
  }, [type]);

  useEffect(() => {
    if (type === 'gift') {
      // Auto-set values for gift vouchers to ensure they're always active
      setQuantity(999999); // Set to maximum quantity
      setStartDate(''); // No start date restriction
      setEndDate(''); // No end date restriction
    }
  }, [type]);

  useEffect(() => {
    if (initialData && initialData.type === 'private' && Array.isArray(initialData.userIds)) {
      setSelectedUsers(initialData.userIds);
      setAddUsers([]);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!code && !initialData) {
      toast.error('Mã voucher là bắt buộc!');
      return;
    }
    if (!discountType) {
      toast.error('Loại giảm giá là bắt buộc!');
      return;
    }
    if (typeof discountValue !== 'number' || discountValue <= 0) {
      toast.error('Giá trị giảm giá phải là số dương!');
      return;
    }
    if (typeof quantity !== 'number' || quantity <= 0) {
      toast.error('Số lượng voucher phải là số dương!');
      return;
    }
    
    // Validation for different types
    if (type === 'private') {
    const allUserIds = [...selectedUsers, ...addUsers];
      if (allUserIds.length === 0) {
      toast.error('Vui lòng chọn user nhận voucher!');
      return;
    }
      if (typeof quantity === 'number' && allUserIds.length > quantity) {
      toast.error('Tổng số user nhận voucher không được vượt quá số lượng voucher!');
      return;
      }
    }

    const dataToSend: Partial<Voucher> = {
      code,
      description: description || undefined,
      type,
      discount_type: discountType,
      discount_value: discountValue,
      max_discount_value: typeof maxDiscountValue === 'number' ? maxDiscountValue : undefined,
      min_order_value: typeof minOrderValue === 'number' ? minOrderValue : undefined,
      quantity: type === 'gift' ? 999999 : quantity, // Always maximum for gift vouchers
      start_date: type === 'gift' ? undefined : (startDate || undefined), // No date restriction for gift
      end_date: type === 'gift' ? undefined : (endDate || undefined), // No date restriction for gift
      ...(type === 'private' ? { userIds: [...selectedUsers, ...addUsers] } : {}),
    };

    onSubmit(dataToSend);
  };

  // Tạo danh sách user chưa sở hữu voucher
  const addableUserOptions = userOptions
    .filter(user => !selectedUsers.includes(user._id))
    .map(user => ({
      value: user._id,
      label: `${user.username} (${user.email})`,
    }));

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-admintext">
          {initialData ? 'Chỉnh sửa Voucher' : 'Thêm Voucher mới'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-admintext">
              Mã Voucher
              {!initialData && <span className="text-red-600 ml-1">*</span>}
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border rounded px-4 py-2 w-full"
              readOnly={!!initialData}
              required={!initialData}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-admintext">
              Loại voucher
              {!initialData && <span className="text-red-600 ml-1">*</span>}
            </label>
            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'public' | 'private' | 'gift')}
                className="appearance-none border rounded px-4 py-2 w-full pr-10 text-sm"
                required={!initialData}
                disabled={!!initialData}
              >
                <option value="public">Công khai</option>
                <option value="private">Riêng tư</option>
                <option value="gift">Quà tặng (Gift)</option>
              </select>
              <FaChevronDown className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
            {type === 'gift' && (
              <div className="text-xs text-blue-600 mt-1">
                Voucher này sẽ được tự động gán cho mốc chi tiêu hàng năm
              </div>
            )}
          </div>

          {type === 'private' && (
            <>
              {initialData ? (
                <>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-admintext">
                      User đã sở hữu voucher
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedUsers.length === 0 ? (
                        <span className="text-gray-400">Chưa có user nào</span>
                      ) : (
                        userOptions
                          .filter(u => selectedUsers.includes(u._id))
                          .map(u => (
                            <span key={u._id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                              {u.username} ({u.email})
                            </span>
                          ))
                      )}
                    </div>
                  </div>
                </>
              ) : null}
              <div>
                <label className="block mb-1 text-sm font-medium text-admintext">
                  {initialData ? 'Thêm user mới vào voucher (tối đa = số lượng)' : 'Chọn user nhận voucher (tối đa = số lượng)'}
                  <span className="text-red-600 ml-1">*</span>
                </label>
                {loadingUsers ? (
                  <div className="text-blue-500 text-sm py-2">Đang tải danh sách user...</div>
                ) : (
                  <Select
                    isMulti
                    options={addableUserOptions}
                    value={addableUserOptions.filter(opt => addUsers.includes(opt.value))}
                    onChange={opts => setAddUsers(Array.isArray(opts) ? opts.map(o => o.value) : [])}
                    isSearchable
                    placeholder="Chọn user để thêm..."
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                )}
                <div className="text-xs text-gray-500 mt-1">
                  {initialData
                    ? 'User đã sở hữu voucher sẽ không thể bỏ chọn.'
                    : 'Chọn user sẽ nhận voucher này.'}
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block mb-1 text-sm font-medium text-admintext">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded px-4 py-2 w-full h-24"
            />
          </div>

          <div className="relative">
            <label className="block mb-1 text-sm font-medium text-admintext">
              Loại giảm giá
              <span className="text-red-600 ml-1">*</span>
            </label>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as 'percent' | 'fixed')}
              className="appearance-none border rounded px-4 py-2 w-full pr-10 text-sm"
              required
            >
              <option value="">-- Chọn loại giảm giá --</option>
              {discountTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute top-2/3 right-3 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-admintext">
              Giá trị giảm giá
              <span className="text-red-600 ml-1">*</span>
            </label>
            <input
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
              className="border rounded px-4 py-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-admintext">
              Giá trị giảm tối đa (nếu có)
            </label>
            <input
              type="number"
              value={maxDiscountValue}
              onChange={(e) => setMaxDiscountValue(Number(e.target.value))}
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-admintext">
              Giá trị đơn hàng tối thiểu (nếu có)
            </label>
            <input
              type="number"
              value={minOrderValue}
              onChange={(e) => setMinOrderValue(Number(e.target.value))}
              className="border rounded px-4 py-2 w-full"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-admintext">
              Số lượng Voucher
              <span className="text-red-600 ml-1">*</span>
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className={`border rounded px-4 py-2 w-full ${type === 'gift' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              required
              disabled={type === 'gift'}
            />
            {type === 'gift' && (
              <div className="text-xs text-blue-600 mt-1">
                Số lượng được tự động set tối đa để voucher gift luôn hoạt động
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-admintext">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`border rounded px-4 py-2 w-full ${type === 'gift' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              min={new Date().toISOString().split('T')[0]}
              disabled={type === 'gift'}
            />
            {type === 'gift' && (
              <div className="text-xs text-blue-600 mt-1">
                Không có giới hạn ngày bắt đầu để voucher gift luôn hoạt động
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-admintext">
              Ngày kết thúc
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`border rounded px-4 py-2 w-full ${type === 'gift' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              min={startDate || new Date().toISOString().split('T')[0]}
              disabled={type === 'gift'}
            />
            {type === 'gift' && (
              <div className="text-xs text-blue-600 mt-1">
                Không có giới hạn ngày kết thúc để voucher gift luôn hoạt động
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate('/admin/vouchers')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Huỷ
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-adminprimary text-white rounded hover:bg-blue-700"
          >
            {initialData ? 'Cập nhật Voucher' : 'Lưu Voucher'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VoucherForm; 