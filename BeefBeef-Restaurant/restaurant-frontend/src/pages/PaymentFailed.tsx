import { useNavigate } from 'react-router-dom';
import ButtonComponents from '../components/common/ButtonComponents';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { useHandleRetryPayment } from '@/hooks/useOrder';


const PaymentFailed = () => {
  const navigate = useNavigate();
  const { mutate: retryPaymentMutate, isPending: retrying } =  useHandleRetryPayment();
  const orderId = new URLSearchParams(window.location.search).get('orderId');

  const handleRetryPayment = () => {
    console.log('Retrying payment for order:', orderId);
    retryPaymentMutate({ orderId: orderId || '' });
  };

  return (
    <>
        <BreadCrumbComponents />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center bg-bodyBackground text-center pt-36 pb-48 "

        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 120 }}
            className="text-red-500 mb-4"
          >
            <AiOutlineCloseCircle size={72} />
          </motion.div>

          <h1 className="text-3xl font-bold mb-2 text-red-600">
            Thanh toán thất bại!
          </h1>
          <p className="mb-6 text-gray-400 max-w-md">
            Rất tiếc, quá trình thanh toán không thành công. Vui lòng kiểm tra phương thức thanh toán hoặc thử lại sau.
          </p>
          <div className="bg-yellow-100 text-yellow-800 text-sm rounded-md px-4 py-3 mb-6 max-w-lg text-justify leading-relaxed">
            Đơn hàng sẽ tự động <strong>hủy sau 30 phút</strong> nếu không được thanh toán thành công.
            Vui lòng hoàn tất thanh toán càng sớm càng tốt để tránh bị hủy.
          </div>

          <div className="flex gap-4">
            <ButtonComponents  onClick={handleRetryPayment}>
              Thanh toán lại
            </ButtonComponents>
            <ButtonComponents
              onClick={() => navigate('/profile/orders')}
              className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
            >
              Lịch sử đơn hàng
            </ButtonComponents>
          </div>
        </motion.div>
    </>
  );
};

export default PaymentFailed;
