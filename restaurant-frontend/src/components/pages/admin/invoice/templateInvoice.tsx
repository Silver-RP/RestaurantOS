import React from "react";
import { FaPrint, FaEnvelope, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { MdPayment, MdLocalShipping, MdLocationOn } from "react-icons/md";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const Invoice = ({ order }: { order?: any }) => {
  const restaurantInfo = {
    name: 'BeefBeef Restaurant',
    address: '161 đường Quốc Hương, Thảo Điền, Quận 2',
    phone: '0239991255',
    email: 'beefbeef@gmail.com',
    logo: '/assets/images/logo.png',
  };

  // Nếu có order truyền vào thì dùng dữ liệu order, nếu không thì dùng dữ liệu mẫu
  const invoiceData = order
    ? {
        number: order._id || '',
        date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '',
        staff: order.staff_name || '',
        customer: {
          name: order.address_id?.full_name || order.receiver || '',
          address: order.address_id?.address || '',
          phone: order.address_id?.phone || order.receiver_phone || '',
          email: order.address_id?.email || '',
        },
        items: order.items || [],
        subtotal: order.subtotal || order.total_price || 0,
        vat: order.vat || 0,
        delivery: order.delivery_fee || 0,
        discount: order.discount || 0,
        total: order.total_price || 0,
        paymentStatus: order.payment_status === 'PAID' ? 'Paid' : 'Unpaid',
        paymentMethod: order.payment_method || '',
      }
    : {
        number: "INV-2024-001",
        date: "2024-01-15",
        staff: "John Smith",
        customer: {
          name: "Sarah Johnson",
          address: "456 Dining Street",
          phone: "+1 (555) 987-6543",
          email: "sarah@email.com"
        },
        items: [
          { id: 1, name: "Grilled Salmon", quantity: 2, price: 29.99, notes: "Medium well" },
          { id: 2, name: "Truffle Risotto", quantity: 1, price: 24.99, notes: "Extra parmesan" },
          { id: 3, name: "Crème Brûlée", quantity: 2, price: 12.99, notes: "" }
        ],
        subtotal: 110.95,
        vat: 11.10,
        delivery: 5.00,
        discount: 10.00,
        total: 117.05,
        paymentStatus: "Paid",
        paymentMethod: "Credit Card"
      };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
      try {
        return format(new Date(dateString), 'dd/MM/yyyy', {
          locale: vi,
        });
      } catch {
        return 'N/A';
      }
    };
  
    const formatPrice = (price: number) => {
      return price.toLocaleString('vi-VN') + '₫';
    };

  const handleEmail = () => {
    window.location.href = `mailto:${invoiceData.customer.email}?subject=Invoice ${invoiceData.number}`;
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] p-4 md:p-8 text-[#2C3E50]">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6 md:p-8">
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
          <div className="bg-[#EBF4FF] p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">
              Hóa đơn #{invoiceData.number.slice(-6).toUpperCase()}
            </h2>
            <p>Ngày: {formatDate(invoiceData.date)}</p>
          </div>
        </div>

        {/* Customer Information and Invoice Details */}
        <div className="mb-8 bg-[#F7FAFC] rounded-lg p-4 border border-[#E2E8F0]">
          <h3 className="text-lg font-semibold mb-3">Thông tin khách hàng</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-bold">{invoiceData.customer.name}</p>
              <p>{invoiceData.customer.address}</p>
              <p>{invoiceData.customer.phone}</p>
            </div>
            <div className="flex items-center justify-end">
              <MdLocalShipping className="text-[#3182CE] mr-2" size={20} />
              <span>Giao hàng tiêu chuẩn</span>
            </div>
          </div>
        </div>

        {/* ... */}
        <div className="grid grid-cols-2 gap-8 mt-6">
          <div className="bg-[#F9FAFB] p-4 rounded-lg">
            <h3 className="font-semibold text-[#1F2937] mb-2">Bill To:</h3>
            <p className="text-[#6B7280]">{invoiceData.customer.name}</p>
            <p className="text-[#6B7280]">{invoiceData.customer.phone}</p>
            <p className="text-[#6B7280]">{invoiceData.customer.address}</p>
          </div>
          <div className="bg-[#F9FAFB] p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-[#6B7280]">INV:</span>
              <span className="text-[#1F2937]">
                {invoiceData.number.slice(-6).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-[#6B7280]">Ngày:</span>
              <span className="text-[#1F2937]">
                {formatDate(invoiceData.date)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-[#6B7280]">Thời gian:</span>
              <span className="text-[#1F2937]">
                {formatDate(invoiceData.date)}
              </span>
            </div>
          </div>
        </div>

        {/* Product Listing */}
        <div className="mb-8 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#EBF4FF]">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Item</th>
                <th className="p-3 text-right">Qty</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-[#E2E8F0] hover:bg-[#F7FAFC] transition-colors"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">
                    {item.name}
                    {item.notes && (
                      <div className="text-sm text-[#718096]">{item.notes}</div>
                    )}
                  </td>
                  <td className="p-3 text-right">{item.quantity}</td>
                  <td className="p-3 text-right">${item.price.toFixed(2)}</td>
                  <td className="p-3 text-right">
                    ${(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment Summary */}
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <div className="bg-[#F7FAFC] p-4 rounded-lg border border-[#E2E8F0]">
              <h3 className="font-semibold mb-2">Payment Information</h3>
              <div className="flex items-center mb-2">
                <MdPayment className="mr-2" />
                <span>{invoiceData.paymentMethod}</span>
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-600">
                {invoiceData.paymentStatus}
              </div>
            </div>
          </div>
          <div className="bg-[#EBF4FF] p-4 rounded-lg w-full md:w-72">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${invoiceData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>VAT (10%)</span>
              <span>${invoiceData.vat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Delivery</span>
              <span>${invoiceData.delivery.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2 text-red-600">
              <span>Discount</span>
              <span>-${invoiceData.discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#CBD5E0] text-[#2C5282] text-xl font-bold">
              <span>Total</span>
              <span>${invoiceData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mb-8">
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-[#3182CE] text-white rounded-lg hover:bg-[#2C5282] transition-colors"
          >
            <FaPrint className="mr-2" /> Print
          </button>
          <button
            onClick={handleEmail}
            className="flex items-center px-4 py-2 bg-[#EBF4FF] text-[#2C5282] rounded-lg hover:bg-[#BEE3F8] transition-colors"
          >
            <FaEnvelope className="mr-2" /> Email
          </button>
        </div>

        {/* Footer */}
        <footer className="text-center border-t border-[#E2E8F0] pt-6">
          <div className="flex justify-center gap-4 mb-4">
            <FaFacebook className="text-[#718096] hover:text-[#2C5282] cursor-pointer" />
            <FaTwitter className="text-[#718096] hover:text-[#2C5282] cursor-pointer" />
            <FaInstagram className="text-[#718096] hover:text-[#2C5282] cursor-pointer" />
          </div>
          <p className="text-[#718096] text-sm">
            © 2024 {restaurantInfo.name}. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Invoice;