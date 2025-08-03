import React, { useEffect, useState } from 'react';
import { ReservationFormData } from '@/types/Reservation.type';
import ButtonComponents from '@/components/common/ButtonComponents';
import { fCurrency } from '@/utils/format-number';
import { toastService } from '@/utils/toastService';
import { MdChair } from 'react-icons/md';
import { FaUsers, FaCreditCard, FaShieldAlt } from 'react-icons/fa';
import { GiKnifeFork } from 'react-icons/gi';
import { BiSolidDiscount } from 'react-icons/bi';
import { useReservations } from '@/hooks/useReservations';
import { holdTableApi } from '@/api/TableReservationApi';
import { toast } from 'react-toastify';
import PaymentMethodSelector, {
  paymentMethods,
} from '../checkout/PaymentMethodSelector';
import { motion } from 'framer-motion';

type Step5DepositProps = {
  formData: ReservationFormData;
  onSuccess: () => void;
  onBack: () => void;
  onPaymentMethodChange: (method: string | null) => void;
};

const Step5Deposit: React.FC<Step5DepositProps> = ({
  formData,
  onSuccess,
  onBack,
  onPaymentMethodChange,
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [isPaying, setIsPaying] = useState(false);
  const [tableDeposit, setTableDeposit] = useState(0);
  const [guestDeposit, setGuestDeposit] = useState(0);
  const [foodDeposit, setFoodDeposit] = useState(0);
  const baseDeposit = 300_000; // Phí giữ bàn cơ bản
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  const { createReservation, confirmReservation } = useReservations();

  const calculateFoodDeposit = (foodTotal: number): number => {
    if (foodTotal <= 0) return 0;

    if (foodTotal <= 1_000_000) {
      return 0;
    } else if (foodTotal <= 2_000_000) {
      return 200_000;
    } else if (foodTotal <= 5_000_000) {
      return 500_000;
    } else if (foodTotal <= 10_000_000) {
      return 1_000_000;
    } else if (foodTotal <= 20_000_000) {
      return 2_000_000;
    } else {
      return Math.floor(foodTotal * 0.15);
    }
  };

  useEffect(() => {
    const { number_of_people, selectedItems, tableCategory } = formData;

    let tableFee = 0;
    if (tableCategory) {
      const depositByTable: Record<string, number> = {
        vip: 500_000,
        group: 200_000,
        quiet: 150_000,
        standard: 100_000,
      };
      tableFee = depositByTable[tableCategory] || 0;
    }

    const guestFee = number_of_people >= 6 ? 300_000 : 0;

    const foodTotal = selectedItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
    const foodFee = calculateFoodDeposit(foodTotal);

    setTableDeposit(tableFee);
    setGuestDeposit(guestFee);
    setFoodDeposit(foodFee);

    setDepositAmount(baseDeposit + tableFee + guestFee + foodFee);
  }, [formData]);

  const getTableTypeDisplayName = (tableCategory?: string): string => {
    switch (tableCategory) {
      case 'vip':
        return 'Bàn VIP';
      case 'group':
        return 'Bàn nhóm';
      case 'quiet':
        return 'Bàn yên tĩnh';
      case 'standard':
        return 'Bàn thường';
      default:
        return 'Không xác định';
    }
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.error('Vui lòng chọn phương thức thanh toán');
      return;
    }
    console.log('🚀 Đang xử lý thanh toán với phương thức:', paymentMethod);
    setIsPaying(true);

    try {
      await holdTableApi({
        table_code: formData.seatingName,
        heldBy: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        date: formData.date,
        time: formData.time,
      });

      const reservationData = {
        full_name: formData.full_name,
        phone: formData.phone,
        email: formData.email,
        date: formData.date,
        time: formData.time,
        table_type: formData.table_type,
        table_code: formData.seatingName,
        number_of_people: formData.number_of_people,
        note: formData.note,
        is_choose_later: formData.selectedItems.length === 0,
        selectedItems: formData.selectedItems,
        payment_method: paymentMethod,
        deposit: depositAmount,
      };

      const result = await createReservation(reservationData);
      console.log('result step5: ', result);

      if (result) {
        if (result._id) {
          await confirmReservation(result._id);
        }

        localStorage.removeItem('reservation-data');
        onSuccess();
      }
    } catch (error) {
      console.error('❌ Lỗi khi đặt bàn:', error);
      toastService.error(
        'Không thể giữ bàn này hoặc đã có người khác giữ trước. Vui lòng chọn lại bàn khác!',
      );
    } finally {
      setIsPaying(false);
    }
  };

  const filteredMethods = paymentMethods.filter((m) => m.value !== 'CASH');

  const selectedFoodTotal = formData.selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <div className="bg-bodyBackground text-white py-0 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto">
        {/* Header với animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl sm:text-3xl mb-2 sm:mb-4 text-secondaryColor uppercase tracking-widest drop-shadow-lg">
            Thanh toán đặt cọc
          </h1>
          <p className="text-base sm:text-md text-gray-300 w-full mx-auto">
            Hoàn tất việc đặt bàn bằng cách thanh toán khoản đặt cọc. Số tiền
            này sẽ được trừ vào hóa đơn cuối cùng.
          </p>
        </motion.div>

        <div className="flex flex-col gap-8">
          {/* Chỉ hiển thị phần đặt cọc với số tiền nổi bật */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-headerBackground/80 border border-secondaryColor/30 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center shadow-lg">
              <h3 className="text-xl sm:text-xl font-bold text-secondaryColor mb-4 flex items-center gap-2">
                <BiSolidDiscount className="text-3xl" />
                Tổng tiền đặt cọc
              </h3>
              <span className="text-3xl sm:text-4xl font-semibold text-secondaryColor drop-shadow-lg mb-2">
                {fCurrency(depositAmount)}
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 w-full">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-bodyBackground/50 border border-secondaryColor/20 rounded-lg p-4 text-center hover:border-secondaryColor/40 transition-all duration-200"
                >
                  <FaShieldAlt className="text-secondaryColor w-10 h-10 mb-3 mx-auto" />
                  <p className="font-semibold text-white mb-2 text-base sm:text-lg">
                    Phí giữ bàn
                  </p>
                  <p className="text-sm sm:text-base text-gray-400 mb-2">
                    Phí cơ bản
                  </p>
                  <span className="text-xl sm:text-2xl font-bold text-secondaryColor">
                    {fCurrency(baseDeposit)}
                  </span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-bodyBackground/50 border border-secondaryColor/20 rounded-lg p-4 text-center hover:border-secondaryColor/40 transition-all duration-200"
                >
                  <MdChair className="text-secondaryColor w-10 h-10 mb-3 mx-auto" />
                  <p className="font-semibold text-white mb-2 text-base sm:text-lg">
                    Cọc theo loại bàn
                  </p>
                  <p className="text-sm sm:text-base text-gray-400 mb-2">
                    {getTableTypeDisplayName(formData.tableCategory)}
                  </p>
                  <span className="text-xl sm:text-2xl font-bold text-secondaryColor">
                    {fCurrency(tableDeposit)}
                  </span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-bodyBackground/50 border border-secondaryColor/20 rounded-lg p-4 text-center hover:border-secondaryColor/40 transition-all duration-200"
                >
                  <FaUsers className="text-secondaryColor w-10 h-10 mb-3 mx-auto" />
                  <p className="font-semibold text-white mb-2 text-base sm:text-lg">
                    Cọc theo số người
                  </p>
                  <p className="text-sm sm:text-base text-gray-400 mb-2">
                    {formData.number_of_people} người
                    {formData.number_of_people >= 6 && ' (≥6 người)'}
                  </p>
                  <span className="text-xl sm:text-2xl font-bold text-secondaryColor">
                    {fCurrency(guestDeposit)}
                  </span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-bodyBackground/50 border border-secondaryColor/20 rounded-lg p-4 text-center hover:border-secondaryColor/40 transition-all duration-200"
                >
                  <GiKnifeFork className="text-secondaryColor w-10 h-10 mb-3 mx-auto" />
                  <p className="font-semibold text-white mb-2 text-base sm:text-lg">
                    Cọc theo món ăn
                  </p>
                  <p className="text-sm sm:text-base text-gray-400 mb-2">
                    {formData.selectedItems.length > 0
                      ? `${formData.selectedItems.length} món (${fCurrency(selectedFoodTotal)})`
                      : 'Chưa chọn món'}
                  </p>
                  <span className="text-xl sm:text-2xl font-bold text-secondaryColor">
                    {fCurrency(foodDeposit)}
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Phương thức thanh toán */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="bg-headerBackground/80 border border-secondaryColor/30 rounded-lg p-4 sm:p-6 mb-0">
              <h3 className="text-xl sm:text-2xl font-bold text-secondaryColor mb-6 flex items-center gap-2">
                <FaCreditCard className="text-2xl" />
                Phương thức thanh toán
              </h3>
              <PaymentMethodSelector
                selectedMethod={paymentMethod}
                showTitle={false}
                onChange={(method) => {
                  setPaymentMethod(method || '');
                  onPaymentMethodChange(method);
                }}
                methods={filteredMethods}
              />
            </div>
          </motion.div>

          {/* Tổng kết và nút thanh toán */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ButtonComponents
                variant="outline"
                size="small"
                onClick={onBack}
                className="px-8 py-3 text-base border-2 border-secondaryColor font-semibold hover:bg-secondaryColor/10 hover:text-secondaryColor transition-all duration-200 min-w-[160px]"
                disabled={isPaying}
              >
                Quay lại
              </ButtonComponents>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ButtonComponents
                variant="filled"
                size="small"
                onClick={handlePayment}
                disabled={isPaying}
                className="px-8 py-3 text-base font-bold shadow-lg hover:shadow-xl transition-all duration-200 min-w-[180px] flex items-center justify-center gap-2 bg-gradient-to-r from-secondaryColor to-secondaryColor/90"
              >
                {isPaying && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                )}
                {isPaying ? 'Đang xử lý...' : 'Thanh toán ngay'}
              </ButtonComponents>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Step5Deposit;
