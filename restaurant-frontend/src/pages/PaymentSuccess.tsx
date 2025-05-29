import { useNavigate } from 'react-router-dom';
import ButtonComponents from '../components/common/ButtonComponents';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { motion } from 'framer-motion';

const PaymentSuccess = () => {
  const navigate = useNavigate();

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
          transition={{ type: 'spring', stiffness: 150 }}
          className="text-green-500 mb-4"
        >
          <AiOutlineCheckCircle size={72} />
        </motion.div>

        <h1 className="text-3xl font-bold mb-2 text-white">
          Thanh toán thành công!
        </h1>
        <p className="mb-6 text-gray-400">
          Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.
        </p>

        <div className="flex gap-4">
          <ButtonComponents onClick={() => navigate('/menu')}>
            Tiếp tục mua sắm
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

export default PaymentSuccess;
