import React, { useEffect, useState } from 'react';
import { ReservationFormData } from '@/types/reservation.type';
import ButtonComponents from '@/components/common/ButtonComponents';
import { fCurrency } from '@/utils/format-number';
import { toastService } from '@/utils/toastService';
import { MdChair } from 'react-icons/md';
import { FaUsers } from 'react-icons/fa';
import { GiKnifeFork } from 'react-icons/gi';

type Step5DepositProps = {
  formData: ReservationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ReservationFormData>>;
  onSuccess: () => void;
  onBack: () => void;
};

const Step5Deposit: React.FC<Step5DepositProps> = ({
  formData,
  setFormData,
  onSuccess,
  onBack,
}) => {
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [isPaying, setIsPaying] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [tableDeposit, setTableDeposit] = useState(0);
  const [guestDeposit, setGuestDeposit] = useState(0);
  const [foodDeposit, setFoodDeposit] = useState(0);

  useEffect(() => {
    const { table_type, number_of_people, selectedItems } = formData;

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

    setTableDeposit(tableFee);
    setGuestDeposit(guestFee);
    setFoodDeposit(foodFee);
    setDepositAmount(tableFee + guestFee + foodFee);
  }, [formData]);
  useEffect(() => {
    const { table_type, number_of_people, selectedItems } = formData;
    let amount = 0;

    if (table_type === 'vip-room') amount += 500_000;
    else if (number_of_people >= 6) amount += 300_000;
    else if (table_type === 'table-4-10') amount += 200_000;

    const foodTotal = selectedItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const foodDeposit = foodTotal > 0 ? foodTotal * 0.2 : 0;

    setDepositAmount(amount + foodDeposit);
  }, [formData]);

  const handleMockPayment = () => {
    setIsPaying(true);

    setTimeout(() => {
      toastService.success('Thanh toán thành công!');
      setIsPaying(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="bg-bodyBackground text-white py-4 px-4 flex items-center justify-center">
      <div className="max-w-7xl mx-auto w-full">
        <h1 className="text-2xl mb-10 text-center text-secondaryColor uppercase tracking-wide">
          Thanh toán đặt cọc
        </h1>

        <div className="bg-headerBackground p-6 rounded-md shadow-md text-center max-w-xl mx-auto">
          <p className="text-lg text-gray-300 mb-2">
            Bạn cần đặt cọc để xác nhận đặt bàn:
          </p>

          <div className="text-4xl font-bold text-secondaryColor mb-4">
            {fCurrency(depositAmount)} VNĐ
          </div>

          <p className="text-sm text-gray-400 mb-6">
            Số tiền này sẽ được trừ vào hóa đơn thanh toán khi bạn đến nhà hàng.
          </p>
          <button
            onClick={() => setShowExplanation(true)}
            className="text-sm underline text-gray-400 hover:text-white mt-2"
          >
            Bạn thắc mắc số tiền đặt cọc được tính như thế nào?
          </button>
        </div>

        <div className="flex justify-center mt-10 gap-6">
          <ButtonComponents
            variant="outline"
            size="medium"
            onClick={onBack}
            className="px-8 py-3 text-sm sm:text-base border-2 transition"
            disabled={isPaying}
          >
            Quay lại
          </ButtonComponents>

          <ButtonComponents
            variant="filled"
            size="medium"
            onClick={handleMockPayment}
            loading={isPaying}
            className="px-8 py-3 text-sm sm:text-base shadow-lg transition"
          >
            {isPaying ? 'Đang xử lý...' : 'Thanh toán'}
          </ButtonComponents>
        </div>
      </div>
      {showExplanation && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-headerBackground text-white px-8 py-6 rounded-md max-w-md w-full relative shadow-xl border border-gray-700">
            <h2 className="text-2xl mb-5 text-center text-secondaryColor">
              Cách tính tiền đặt cọc
            </h2>

            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-start gap-2">
                <MdChair className="text-secondaryColor w-5 h-5 mt-1" />
                <div>
                  <p className="font-medium text-white text-left mb-1">
                    Cọc theo loại bàn:
                  </p>
                  <p>
                    – {formData.seatingName || 'Không xác định'}:&nbsp;
                    <strong className="text-secondaryColor">
                      {fCurrency(tableDeposit)}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <FaUsers className="text-secondaryColor w-5 h-5 mt-1" />
                <div>
                  <p className="font-medium text-white text-left mb-1">
                    Cọc theo số lượng người:
                  </p>
                  <p className="text-left">
                    – {formData.number_of_people} người →&nbsp;
                    <strong className="text-secondaryColor">
                      {fCurrency(guestDeposit)}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <GiKnifeFork className="text-secondaryColor w-5 h-5 mt-1" />
                <div>
                  <p className="font-medium text-white text-left mb-1">
                    Cọc theo món ăn đã chọn:
                  </p>
                  <p>
                    – 20% giá trị món ăn đã chọn →&nbsp;
                    <strong className="text-secondaryColor">
                      {fCurrency(foodDeposit)}
                    </strong>
                  </p>
                </div>
              </div>

              <hr className="my-4 border-gray-600" />

              <div className="text-white text-base font-semibold text-center">
                Tổng tiền đặt cọc:&nbsp;
                <span className="text-secondaryColor">
                  {fCurrency(depositAmount)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowExplanation(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step5Deposit;
