import React from 'react';
import {
  FaPrint,
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useOrderDetail } from '@/hooks/useOrder';
import { Dialog, DialogContent } from '@mui/material';
interface InvoiceProps {
  orderId: string;
  onReady?: () => void;
}

const InvoiceExport: React.FC<InvoiceProps> = ({ orderId, onReady }) => {
  const { data: orderDetail, isLoading } = useOrderDetail(orderId);
  const [notifiedReady, setNotifiedReady] = React.useState(false);

  React.useEffect(() => {
    if (orderDetail?.order && onReady && !notifiedReady) {
      onReady();
      setNotifiedReady(true);
    }
    if (!orderDetail?.order && notifiedReady) {
      setNotifiedReady(false);
    }
  }, [orderDetail?.order, onReady, notifiedReady, orderId]);

  const restaurantInfo = {
    name: 'CÔNG TY TNHH BEEFBEEF',
    address: '161 Quốc Hương, P. Thảo Điền, Quận 2, Tp. HCM',
    phone: '0239991255',
    email: 'beefbeef@gmail.com',
    logo: '/assets/images/logo.png',
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch {
      return 'N/A';
    }
  };

  const formatHour = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm', { locale: vi });
    } catch {
      return 'N/A';
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = (email: string, invoiceNumber: string) => {
    window.location.href = `mailto:${email}?subject=Invoice ${invoiceNumber}`;
  };

  if (isLoading) {
    return (
      <Dialog open={true} maxWidth="md" fullWidth>
        <DialogContent>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Đang tải...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!orderDetail?.order) {
    return (
      <Dialog open={true} maxWidth="md" fullWidth>
        <DialogContent>
          <div className="text-center py-8 text-gray-500">
            <p>Không tìm thấy thông tin đơn hàng</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const { order } = orderDetail;

  const invoiceData = {
    number: order._id || '',
    date: order.createdAt || '',
    customer: {
      name: order.address_id?.full_name || order.receiver || 'Khách vãng lai',
      address: order.address_id
        ? `${order.address_id.street_address}, ${order.address_id.ward}, ${order.address_id.district}, ${order.address_id.province}`
        : '',
      phone: order.address_id?.phone || order.receiver_phone || '',
    },
    items: order.order_items || [],
    subtotal: order.items_price || 0,
    vat: order.vat_amount || 0,
    delivery: order.shipping_fee || 0,
    discount: order.discount || 0,
    total: order.total_price || 0,
    paymentStatus:
      order.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán',
    paymentMethod: order.payment_method
      ? {
          CASH: 'Tiền mặt',
          CREDIT_CARD: 'Thẻ tín dụng',
          MOMO: 'Ví MoMo',
          VNPAY: 'VNPay',
        }[order.payment_method] || order.payment_method
      : '',
  };

  return (
    <>
      <div className="min-h-screen p-4 md:p-8 text-[#2C3E50] invoice-printable">
        <div className="max-w-4xl mx-auto bg-white rounded  p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-8 border-b border-[#E2E8F0] pb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <img
                src={restaurantInfo.logo}
                alt="Restaurant Logo"
                className="h-24 rounded-full mr-4"
              />
              <div>
                <h1 className="text-2xl font-bold text-[#2C5282]">
                  {restaurantInfo.name}
                </h1>
                <p className="text-[#4A5568]">{restaurantInfo.address}</p>
                <p className="text-[#4A5568]">{restaurantInfo.phone}</p>
              </div>
            </div>
          </div>

          {/* Customer and Invoice Info */}
          <div className="grid mb-8 grid-cols-2 gap-8 mt-6">
            <div className="bg-[#F7FAFC] border border-[#E2E8F0] p-4 rounded">
              <p className="font-semibold text-ld text-[#1F2937] mb-2">
                Thông tin khách hàng
              </p>
              <p className="text-[#1F2937] mb-2">{invoiceData.customer.name}</p>
              <p className="text-[#1F2937] mb-2">
                {invoiceData.customer.phone}
              </p>
            </div>
            <div className="bg-[#F7FAFC] border border-[#E2E8F0] p-4 rounded">
              <div className="flex justify-between mb-2">
                <span className="text-[#1F2937] font-semibold">
                  Mã đơn hàng:
                </span>
                <span className="text-[#1F2937]">
                  {invoiceData.number.slice(-6).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-[#1F2937] font-semibold">Giờ:</span>
                <span className="text-[#1F2937]">
                  {formatHour(invoiceData.date)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-[#1F2937] font-semibold">Ngày:</span>
                <span className="text-[#1F2937]">
                  {formatDate(invoiceData.date)}
                </span>
              </div>
            </div>
          </div>

          {/* Product Listing */}
          <div className="mb-8 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F7FAFC] rounded border border-[#E2E8F0] text-[#1F2937]">
                <tr>
                  <th className="p-3 text-left">Sản phẩm</th>
                  <th className="p-3 text-right">Số lượng</th>
                  <th className="p-3 text-right">Giá</th>
                  <th className="p-3 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-[#E2E8F0] hover:bg-[#F7FAFC] transition-colors"
                  >
                    <td className="p-3">
                      {item.dish_name}
                      {item.note && (
                        <div className="text-sm text-[#718096]">
                          Ghi chú: {item.note}
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-right">{item.quantity}</td>
                    <td className="p-3 text-right">
                      {formatPrice(item.unit_price)}
                    </td>
                    <td className="p-3 text-right">
                      {formatPrice(item.total_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment Summary */}
          <div className="flex flex-col md:flex-row justify-end mb-4">
            <div className="bg-[#F7FAFC] rounded border border-[#E2E8F0] p-4 w-full md:w-[360px]">
              <div className="flex justify-between mb-2">
                <span>Tạm tính</span>
                <span>{formatPrice(invoiceData.subtotal)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>VAT (8%)</span>
                <span>{formatPrice(invoiceData.vat)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Phí giao hàng</span>
                <span>{formatPrice(invoiceData.delivery)}</span>
              </div>

              {invoiceData.discount !== 0 && (
                <div className="flex justify-between mb-2 text-red-600">
                  <span>Giảm giá</span>
                  <span>-{formatPrice(invoiceData.discount)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-[#CBD5E0] text-[#1F2937] text-lg font-bold">
                <span>Tổng cộng</span>
                <span>{formatPrice(invoiceData.total)}</span>
              </div>
            </div>
          </div>

          {/* thank you */}
          <div className="text-center mt-16 mb-4 print:mt-10">
            <p className="text-[48px] text-[#1F2937] font-handwriting ">
              Thank you!
            </p>
          </div>

          {/* Footer */}
          <footer className="text-center border-t border-[#E2E8F0] pt-6 no-print">
            <div className="flex justify-center gap-4 mb-4">
              <FaFacebook className="text-[#718096] hover:text-[#2C5282] cursor-pointer" />
              <FaTwitter className="text-[#718096] hover:text-[#2C5282] cursor-pointer" />
              <FaInstagram className="text-[#718096] hover:text-[#2C5282] cursor-pointer" />
            </div>
            <p className="text-[#718096] text-sm">
              © 2025 {restaurantInfo.name}. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default InvoiceExport;
