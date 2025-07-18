import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonComponents from '../components/common/ButtonComponents';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { FiDownload } from 'react-icons/fi';
import React from 'react';
import Cookies from 'js-cookie';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [bankingInfo, setBankingInfo] = useState<null | {
    bank_name: string;
    account_name: string;
    account_number: string;
    qr_code: string;
    transfer_note: string;
  }>(null);

  const [type, setType] = useState<'order' | 'reservation'>('order');
  const orderTotal = parseFloat(sessionStorage.getItem('orderTotal') || '0');

  const shortOrderId = bankingInfo?.transfer_note
    ? bankingInfo.transfer_note.slice(-6).toUpperCase()
    : '';

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const paymentMethod = query.get('method');
    const typeParam = query.get('type') as 'order' | 'reservation';
    if (typeParam === 'reservation') setType('reservation');

    // Clear banking info if redirect from online payment
    if (
      paymentMethod === 'vnpay' ||
      paymentMethod === 'paypal' ||
      paymentMethod === 'momo'
    ) {
      sessionStorage.removeItem('recentBankingInfo');
    }

    const storedInfo = sessionStorage.getItem('recentBankingInfo');
    if (storedInfo) {
      setBankingInfo(JSON.parse(storedInfo));
    }

    const orderTotal = sessionStorage.getItem('orderTotal');
    if (orderTotal) {
      const total = parseFloat(orderTotal);
      if (isNaN(total)) {
        console.error('Invalid order total in sessionStorage');
      }
    } else {
      console.error('Order total not found in sessionStorage');
    }
  }, []);

  const isReservation = type === 'reservation';
  const userInfo = Cookies.get('userInfo');
  const isLoggedIn = !!userInfo;

  let buttonLabel = '';
  let targetPath = '';

  if (isReservation) {
    buttonLabel = isLoggedIn ? 'Lịch sử đặt bàn' : 'Tra cứu đặt bàn';
    targetPath = isLoggedIn ? '/profile/my-reservation' : '/reservation/lookup-reservation';
  } else if (isLoggedIn) {
    buttonLabel = 'Lịch sử đơn hàng';
    targetPath = '/profile/orders';
  }

  return (
    <>
      <BreadCrumbComponents />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center bg-bodyBackground text-center pt-24 pb-20"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 150 }}
          className="text-green-500 mb-4"
        >
          <AiOutlineCheckCircle size={72} />
        </motion.div>

        <h1 className="text-3xl font-bold mb-2 text-white">
          Thanh toán thành công!
        </h1>
        <p className="mb-6 text-gray-400 max-w-lg leading-relaxed">
          Cảm ơn bạn đã {isReservation ? 'đặt bàn' : 'đặt hàng'}.
          {isReservation
            ? ' Lịch sử đặt bàn của bạn đã được cập nhật.'
            : ' Đơn hàng đang được xử lý.'}
          Vui lòng kiểm tra email hoặc trang lịch sử để theo dõi chi tiết.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <ButtonComponents onClick={() => navigate('/menu?sort=categoryAZ')}>
            Tiếp tục mua sắm
          </ButtonComponents>
          {buttonLabel && (
            <ButtonComponents
              onClick={() => navigate(targetPath)}
              className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
            >
              {buttonLabel}
            </ButtonComponents>
          )}
        </div>
      </motion.div>

      {bankingInfo && (
        <div className="bg-bodyBackground flex justify-center px-4 pb-24">
          <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-6 w-full max-w-2xl text-left text-white border border-white/10">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Thông tin chuyển khoản
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <p>
                  <strong>Ngân hàng:</strong> {bankingInfo.bank_name}
                </p>
                <p>
                  <strong>Chủ tài khoản:</strong> {bankingInfo.account_name}
                </p>
                <p>
                  <strong>Số tài khoản:</strong> {bankingInfo.account_number}
                </p>
                <p>
                  <strong>Số tiền:</strong>{' '}
                  <span className="ml-1 font-semibold text-green-300">
                    {orderTotal.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </span>
                </p>
                <p>
                  <strong>Nội dung chuyển khoản:</strong> <br />
                  <span className="font-semibold text-yellow-300">
                    ORDER-{shortOrderId}
                  </span>
                </p>
                <p>
                  <strong>Mã đơn hàng:</strong>{' '}
                  <span className="font-semibold text-green-300">
                    {shortOrderId}
                  </span>
                </p>
                <p className="text-red-400 text-sm font-medium">
                  ⚠️ Vui lòng nhập chính xác nội dung chuyển khoản{' '}
                  <strong className="text-yellow-300">
                    ORDER-{shortOrderId}
                  </strong>{' '}
                  để hệ thống xác nhận tự động.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-4">
                <img
                  src={bankingInfo.qr_code}
                  alt="QR Code"
                  className="w-52 h-52 object-contain border rounded-xl shadow-lg bg-white"
                />
                <a
                  href={bankingInfo.qr_code}
                  download={`QR_ORDER_${shortOrderId}.png`}
                  className="flex items-center gap-2 text-sm px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                >
                  <FiDownload />
                  Tải mã QR
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentSuccess;
