import React, { useEffect, useState } from 'react';
import { getAllVouchers } from '@/api/VoucherApi';
import { Voucher } from '@/types/Voucher.type';

const PublicVoucherSection: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllVouchers({ type: 'public', status: 'active', limit: 5 })
      .then(res => setVouchers(res.data.docs))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (!vouchers.length) return null;

  return (
    <section className="bg-bodyBackground my-8 px-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Ưu đãi dành cho bạn</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vouchers.map(voucher => (
          <div key={voucher._id} className="border rounded-lg p-4 shadow "></div>
            <div className="font-semibold text-lg mb-2">{voucher.code}</div>
            <div className="mb-1">{voucher.description || 'Không có mô tả'}</div>
            <div>
              <span className="font-bold">Loại: </span>
              {voucher.discount_type === 'percent'
                ? `Giảm ${voucher.discount_value}%`
                : `Giảm ${voucher.discount_value.toLocaleString()} VNĐ`}
            </div>
            <div>
              <span className="font-bold">HSD: </span>
              {voucher.end_date ? new Date(voucher.end_date).toLocaleDateString() : 'Không giới hạn'}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PublicVoucherSection; 