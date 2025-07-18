import React, { useEffect, useState } from 'react';
import { ReservationFormData } from '@/types/Reservation.type';
import ButtonComponents from '@/components/common/ButtonComponents';
import { fCurrency } from '@/utils/format-number';
import { toastService } from '@/utils/toastService';
import { MdChair } from 'react-icons/md';
import { FaUsers } from 'react-icons/fa';
import { GiKnifeFork } from 'react-icons/gi';
import { useReservations } from '@/hooks/useReservations';
import { holdTableApi } from '@/api/TableReservationApi';
import { toast } from 'react-toastify';
import PaymentMethodSelector,  { paymentMethods } from '../checkout/PaymentMethodSelector';

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
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [isPaying, setIsPaying] = useState(false);
  const [tableDeposit, setTableDeposit] = useState(0);
  const [guestDeposit, setGuestDeposit] = useState(0);
  const [foodDeposit, setFoodDeposit] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  const { createReservation, confirmReservation } = useReservations();

  useEffect(() => {
    const { table_type, number_of_people, selectedItems } = formData;
  
    const baseDeposit = 300_000; 
    const depositByTable: Record<string, number> = {
      'vip-room': 500_000,
      'table-4-10': 200_000,
    };
  
    const tableFee = depositByTable[table_type] || 0;
    const guestFee = number_of_people >= 6 ? 300_000 : 0;
  
    const foodTotal = selectedItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
    const foodFee = foodTotal > 0 ? Math.floor(foodTotal * 0.2) : 0;
  
    // Cập nhật các phần chi tiết
    setTableDeposit(tableFee);
    setGuestDeposit(guestFee);
    setFoodDeposit(foodFee);
  
    setDepositAmount(baseDeposit + tableFee + guestFee + foodFee);
  }, [formData]);
  

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.error('Vui lòng chọn phương thức thanh toán');
      return;
    }
    console.log('🚀 Đang xử lý thanh toán với phương thức:', paymentMethod);
    setIsPaying(true);

    try {
      // Gọi API giữ bàn trước khi tạo reservation
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

      // Gọi API tạo reservation
      const result = await createReservation(reservationData);
      console.log("result step5: ", result);

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

  const filteredMethods = paymentMethods.filter(m => m.value !== 'CASH');

  return (
    <div className="bg-bodyBackground text-white py-8 px-2 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto">
        <h1 className="text-3xl mb-8 text-center text-secondaryColor uppercase tracking-widest font-restora font-bold drop-shadow-lg">
          Thanh toán đặt cọc
        </h1>

        {/* Tổng tiền đặt cọc nổi bật */}
        <div className="bg-headerBackground/80 border-2 border-secondaryColor shadow-xl p-8 mb-8 flex flex-col items-center">
          <p className="text-lg text-gray-300 mb-2 font-medium tracking-wide">
            Bạn cần đặt cọc để xác nhận đặt bàn:
          </p>
          <div className="text-5xl font-extrabold text-secondaryColor mb-2 drop-shadow-lg flex items-center gap-2">
            {fCurrency(depositAmount)}
            <span className="text-2xl font-bold"></span>
            <span className="text-lg font-semibold text-gray-300 ml-1">
              VNĐ
            </span>
          </div>
          <p className="text-sm text-gray-400 mb-2 text-center">
            Số tiền này có bao gồm 300.000 VNĐ đặt cọc giữ bàn và sẽ 
            được trừ vào hóa đơn thanh toán khi bạn đến nhà hàng.
          </p>
        </div>

        {/* Card giải thích các khoản cọc */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Cọc theo loại bàn */}
          <div className="bg-headerBackground/90 border border-secondaryColor/40 p-4 flex flex-col items-center shadow-md">
            <MdChair className="text-secondaryColor w-8 h-8 mb-2" />
            <p className="font-semibold text-white mb-1 text-center">
              Cọc theo loại bàn
            </p>
            <p className="text-xs text-gray-400 mb-1 text-center">
              {formData.seatingName || 'Không xác định'}
            </p>
            <span className="text-xl font-bold text-secondaryColor">
              {fCurrency(tableDeposit)}
            </span>
          </div>
          {/* Cọc theo số lượng người */}
          <div className="bg-headerBackground/90 border border-secondaryColor/40 p-4 flex flex-col items-center shadow-md">
            <FaUsers className="text-secondaryColor w-8 h-8 mb-2" />
            <p className="font-semibold text-white mb-1 text-center">
              Cọc theo số lượng người
            </p>
            <p className="text-xs text-gray-400 mb-1 text-center">
              {formData.number_of_people} người
            </p>
            <span className="text-xl font-bold text-secondaryColor">
              {fCurrency(guestDeposit)}
            </span>
          </div>
          {/* Cọc theo món ăn đã chọn */}
          <div className="bg-headerBackground/90 border border-secondaryColor/40 p-4 flex flex-col items-center shadow-md">
            <GiKnifeFork className="text-secondaryColor w-8 h-8 mb-2" />
            <p className="font-semibold text-white mb-1 text-center">
              Cọc theo món ăn đã chọn
            </p>
            <p className="text-xs text-gray-400 mb-1 text-center">
              20% giá trị món ăn đã chọn nếu có giá trên 1 triệu
            </p>
            <span className="text-xl font-bold text-secondaryColor">
              {fCurrency(foodDeposit)}
            </span>
          </div>
        </div>

        {/* Tổng tiền đặt cọc lần nữa */}
        <div className="bg-headerBackground/80 border border-secondaryColor/60 shadow p-4 mb-8 flex flex-col items-center">
          <span className="text-base text-white font-semibold mb-1">
            Tổng tiền đặt cọc
          </span>
          <span className="text-3xl font-bold text-secondaryColor drop-shadow-lg">
            {fCurrency(depositAmount)}
          </span>
        </div>

        <div className="mt-4 mb-12 md:mt-6 flex flex-col md:flex-row md:gap-4">
          {/* Phương thức thanh toán */}
          <div className="flex-1 text-left ">
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onChange={(method) => {
                setPaymentMethod(method || '');
                onPaymentMethodChange(method);
              }}
              methods={filteredMethods}
            />
          </div>
        </div>

        {/* Nút điều hướng */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-6">
          <ButtonComponents
            variant="outline"
            size="large"
            onClick={onBack}
            className="px-10 py-3 text-base border-2  font-semibold hover:bg-secondaryColor/10 hover:text-secondaryColor transition-all duration-200 min-w-[140px]"
            disabled={isPaying}
          >
            Quay lại
          </ButtonComponents>

          <ButtonComponents
            variant="filled"
            size="large"
            onClick={handlePayment}
            disabled={isPaying}
            className="px-10 py-3 text-base font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 min-w-[160px] flex items-center justify-center gap-2"
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
            {isPaying ? 'Đang xử lý...' : 'Thanh toán'}
          </ButtonComponents>
        </div>
      </div>
    </div>
  );
};

export default Step5Deposit;
