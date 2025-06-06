import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

type FiltersType = {
  status: string;
  payment_method: string;
  delivery_type: string;
  order_type: string;
  createdAtStart: string;
  createdAtEnd: string;
  total_priceMin: string;
  total_priceMax: string;
};

interface OrderFilterPanelProps {
  onApply: (filters: FiltersType) => void;
  initialFilters?: Partial<FiltersType>;
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
}

const OrderFilterPanel: React.FC<OrderFilterPanelProps> = ({
  onApply,
  initialFilters = {},
  searchParams,
  setSearchParams,
}) => {
  const [filters, setFilters] = useState<FiltersType>({
    status: initialFilters.status || '',
    payment_method: initialFilters.payment_method || '',
    delivery_type: initialFilters.delivery_type || '',
    order_type: initialFilters.order_type || '',
    createdAtStart: initialFilters.createdAtStart || '',
    createdAtEnd: initialFilters.createdAtEnd || '',
    total_priceMin: initialFilters.total_priceMin || '',
    total_priceMax: initialFilters.total_priceMax || '',
  });

  const [errors, setErrors] = useState({
    dates: '',
    prices: '',
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      status: initialFilters?.status || '',
      payment_method: initialFilters?.payment_method || '',
      delivery_type: initialFilters?.delivery_type || '',
      order_type: initialFilters?.order_type || '',
      createdAtStart: initialFilters?.createdAtStart || '',
      createdAtEnd: initialFilters?.createdAtEnd || '',
      total_priceMin: initialFilters?.total_priceMin || '',
      total_priceMax: initialFilters?.total_priceMax || '',
    }));
  }, [initialFilters]);

  const validateDates = (start: string, end: string): boolean => {
    if (!start || !end) return true;
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (startDate > endDate) {
      setErrors((prev) => ({
        ...prev,
        dates: 'Ngày bắt đầu phải trước hoặc bằng ngày kết thúc',
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, dates: '' }));
    return true;
  };

  const validatePrices = (min: string, max: string): boolean => {
    if (!min || !max) return true;
    const minPrice = Number(min);
    const maxPrice = Number(max);
    if (minPrice > maxPrice) {
      setErrors((prev) => ({
        ...prev,
        prices: 'Giá trị tối thiểu phải nhỏ hơn hoặc bằng giá trị tối đa',
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, prices: '' }));
    return true;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };

      // Validate on change
      if (name === 'createdAtStart' || name === 'createdAtEnd') {
        validateDates(
          name === 'createdAtStart' ? value : prev.createdAtStart,
          name === 'createdAtEnd' ? value : prev.createdAtEnd,
        );
      }

      if (name === 'total_priceMin' || name === 'total_priceMax') {
        validatePrices(
          name === 'total_priceMin' ? value : prev.total_priceMin,
          name === 'total_priceMax' ? value : prev.total_priceMax,
        );
      }

      return newFilters;
    });
  };

  const handleApply = () => {
    // Validate before applying
    const datesValid = validateDates(
      filters.createdAtStart,
      filters.createdAtEnd,
    );
    const pricesValid = validatePrices(
      filters.total_priceMin,
      filters.total_priceMax,
    );

    if (!datesValid || !pricesValid) {
      toast.error('Vui lòng kiểm tra lại các giá trị lọc');
      return;
    }

    onApply(filters);
  };

  return (
    <div className="border rounded p-4 bg-white shadow-md w-full mx-auto mb-6">
      <h2 className="text-lg font-semibold mb-4">Bộ lọc đơn hàng</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Trạng thái đơn hàng */}
        <div>
          <label className="block text-sm mb-1">Trạng thái đơn hàng</label>
          <select
            name="status"
            className="w-full border rounded px-2 py-1"
            value={filters.status}
            onChange={handleChange}
            aria-label="Trạng thái đơn hàng"
          >            <option value="">Tất cả</option>
            <option value="ORDER_PLACED">Đơn hàng mới</option>
            <option value="ORDER_CONFIRMED">Đã xác nhận đơn hàng</option>
            <option value="PENDING_PICKUP">Chờ nhận hàng/Chuẩn bị đơn hàng</option>
            <option value="IN_TRANSIT">Đang giao/Đã chuẩn bị xong</option>
            <option value="DELIVERED">Giao thành công/Đã lấy hàng</option>
            <option value="DELIVERY_FAILED">Giao hàng thất bại</option>
            <option value="CANCELLED">Đã hủy</option>
            <option value="RETURN_REQUESTED">Yêu cầu trả hàng</option>
            <option value="RETURN_APPROVED">Đã xác nhận trả hàng</option>
            <option value="RETURNED">Đã trả hàng</option>
          </select>
        </div>

        {/* Phương thức thanh toán */}
        <div>
          <label className="block text-sm mb-1">Phương thức thanh toán</label>
          <select
            name="payment_method"
            className="w-full border rounded px-2 py-1"
            value={filters.payment_method}
            onChange={handleChange}
            aria-label="Phương thức thanh toán"
          >
            <option value="">Tất cả</option>
            <option value="CASH">Tiền mặt</option>
            <option value="CREDIT_CARD">Thẻ tín dụng</option>
            <option value="MOMO">Ví MoMo</option>
            <option value="VNPAY">VNPay</option>
          </select>
        </div>

        {/* Loại giao hàng */}
        <div>
          <label className="block text-sm mb-1">Loại giao hàng</label>
          <select
            name="delivery_type"
            className="w-full border rounded px-2 py-1"
            value={filters.delivery_type}
            onChange={handleChange}
            aria-label="Loại giao hàng"
          >
            <option value="">Tất cả</option>
            <option value="DELIVERY">Giao hàng</option>
            <option value="PICKUP">Lấy tại cửa hàng</option>
          </select>
        </div>

        {/* Loại đơn hàng */}
        <div>
          <label className="block text-sm mb-1">Loại đơn hàng</label>
          <select
            name="order_type"
            className="w-full border rounded px-2 py-1"
            value={filters.order_type}
            onChange={handleChange}
            aria-label="Loại đơn hàng"
          >
            <option value="">Tất cả</option>
            <option value="ONLINE">Trực tuyến</option>
            <option value="DINE_IN">Tại chỗ</option>
          </select>
        </div>

        {/* Ngày đặt hàng */}
        <div>
          <label className="block text-sm mb-1">Từ ngày</label>
          <input
            type="date"
            name="createdAtStart"
            className="w-full border rounded px-2 py-1"
            value={filters.createdAtStart}
            onChange={handleChange}
            aria-label="Từ ngày"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Đến ngày</label>
          <input
            type="date"
            name="createdAtEnd"
            className="w-full border rounded px-2 py-1"
            value={filters.createdAtEnd}
            onChange={handleChange}
            aria-label="Đến ngày"
            min={filters.createdAtStart} // Không cho chọn ngày trước ngày bắt đầu
          />
        </div>

        {/* Tổng giá trị */}
        <div>
          <label className="block text-sm mb-1">Giá trị từ</label>
          <input
            type="number"
            name="total_priceMin"
            className="w-full border rounded px-2 py-1"
            value={filters.total_priceMin}
            onChange={handleChange}
            placeholder="VNĐ"
            aria-label="Giá trị từ"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Giá trị đến</label>
          <input
            type="number"
            name="total_priceMax"
            className="w-full border rounded px-2 py-1"
            value={filters.total_priceMax}
            onChange={handleChange}
            placeholder="VNĐ"
            aria-label="Giá trị đến"
            min={filters.total_priceMin || '0'}
          />
        </div>
      </div>

      {errors.dates && (
        <p className="text-red-500 text-sm mt-2">{errors.dates}</p>
      )}
      {errors.prices && (
        <p className="text-red-500 text-sm mt-2">{errors.prices}</p>
      )}

      <div className="mt-5">
        <button
          onClick={handleApply}
          className="px-3 py-2 bg-blue-600 text-sm text-white rounded hover:bg-blue-700 mr-3"
        >
          Áp dụng bộ lọc
        </button>

        <button
          onClick={() => {
            const emptyFilters: FiltersType = {
              status: '',
              payment_method: '',
              delivery_type: '',
              order_type: '',
              createdAtStart: '',
              createdAtEnd: '',
              total_priceMin: '',
              total_priceMax: '',
            };

            setFilters(emptyFilters);
            const newParams = new URLSearchParams(searchParams.toString());
            Object.keys(emptyFilters).forEach((key) => {
              newParams.delete(key);
            });
            newParams.delete('keyword');
            newParams.set('page', '1');
            setSearchParams(newParams);
            onApply(emptyFilters);
          }}
          className="px-4 py-2 bg-gray-300 text-black text-sm rounded hover:bg-gray-400"
        >
          Xoá bộ lọc
        </button>
      </div>
    </div>
  );
};

export default OrderFilterPanel;
