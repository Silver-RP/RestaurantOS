import { useNavigate } from 'react-router-dom';
import ButtonComponents from '../components/common/ButtonComponents';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { useHandleRetryPayment } from '@/hooks/useOrder';
import Cookies from 'js-cookie';

const PaymentFailed = () => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const id = new URLSearchParams(window.location.search).get('id') || '';
  const type = (searchParams.get('type') || 'order') as 'order' | 'reservation'; 

  const { mutate: retryPaymentMutate, isPending: retrying } =
    useHandleRetryPayment();

  const handleRetryPayment = () => {
    retryPaymentMutate({ type, id });
  };

  const isReservation = type === 'reservation';
  const userInfo = Cookies.get('userInfo');
  const isLoggedIn = !!userInfo;

  const buttonLabel = isReservation
  ? isLoggedIn ? 'Lịch sử đặt bàn' : 'Tra cứu đặt bàn'
  : isLoggedIn ? 'Lịch sử đơn hàng' : '';

  
  return (
    <>
      <BreadCrumbComponents />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center bg-bodyBackground text-center pt-36 pb-48"
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
          {isReservation
            ? 'Rất tiếc, quá trình thanh toán tiền đặt bàn không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.'
            : 'Rất tiếc, quá trình thanh toán đơn hàng không thành công. Vui lòng kiểm tra phương thức thanh toán hoặc thử lại sau.'}
        </p>

        <div className="bg-yellow-100 text-yellow-800 text-sm rounded-md px-4 py-3 mb-6 max-w-lg text-justify leading-relaxed">
          {isReservation ? (
            <>
              "Đặt bàn của bạn sẽ <strong>bị hủy sau 60 phút</strong> nếu thanh
              toán không được hoàn tất. Hãy kiểm tra email và thanh toán sớm để
              giữ chỗ."
            </>
          ) : (
            <>
              Đơn hàng sẽ <strong>tự động hủy sau 30 phút</strong> nếu không
              được thanh toán thành công. Vui lòng hoàn tất thanh toán càng sớm
              càng tốt để tránh bị hủy.
            </>
          )}
        </div>

        <div className="flex gap-4">
          <ButtonComponents onClick={handleRetryPayment} disabled={retrying}>
            {retrying ? 'Đang xử lý...' : 'Thanh toán lại'}
          </ButtonComponents>

          <ButtonComponents
            onClick={() => {
              const userInfo = Cookies.get('userInfo');
              const targetPath = isReservation
                ? userInfo
                  ? '/profile/my-reservation'
                  : '/reservation/lookup-reservation'
                : userInfo
                  ? '/profile/orders'
                  : '';
              navigate(targetPath);
            }}
            className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
          >
             {buttonLabel}
          </ButtonComponents>
        </div>
      </motion.div>
    </>
  );
};

export default PaymentFailed;
