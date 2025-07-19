import React, { useState } from 'react';
import { ReservationFormData } from '@/types/Reservation.type';
import ButtonComponents from '@/components/common/ButtonComponents';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {
  MdChair,
  MdCalendarToday,
  MdPerson,
  MdPhone,
  MdEmail,
} from 'react-icons/md';
import { FaUsers } from 'react-icons/fa';
import { GiKnifeFork } from 'react-icons/gi';
import { fCurrency } from '@/utils/format-number';

interface Step4ReviewProps {
  formData: ReservationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ReservationFormData>>;
  onBack: () => void;
  onNext: () => void;
}

const Step4Review: React.FC<Step4ReviewProps> = ({
  formData,
  onNext,
  onBack,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmReservation = async () => {
    setIsSubmitting(true);
    try {
      localStorage.removeItem('reservation-data');
      onNext();
    } catch (error) {
      console.error('❌ Đặt bàn thất bại:', error);
      toast.error('Có lỗi xảy ra khi đặt bàn. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm helper để hiển thị tên loại bàn
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

  // Tính tổng giá trị món ăn đã chọn
  const selectedFoodTotal = formData.selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <div className="bg-bodyBackground text-white py-8 px-4 flex items-center justify-center min-h-screen">
      <div className="max-w-4xl w-full mx-auto">
        {/* Header với animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl mb-4 text-secondaryColor uppercase tracking-widest font-restora font-bold drop-shadow-lg">
            Xác nhận thông tin đặt bàn
          </h1>
          <p className="text-gray-300 text-lg w-full mx-auto">
            Vui lòng kiểm tra lại thông tin đặt bàn trước khi tiếp tục. Đảm bảo
            mọi thông tin đều chính xác.
          </p>
        </motion.div>

        <div className="flex flex-col gap-8">
          {/* Thông tin đặt bàn */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-headerBackground/90 border border-secondaryColor/30 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-secondaryColor mb-6 flex items-center gap-2">
                <MdPerson className="text-2xl" />
                Thông tin đặt bàn
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-3 bg-bodyBackground/50 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <MdPerson className="text-secondaryColor text-xl" />
                    <span className="text-sm text-gray-400 font-medium">
                      Tên khách hàng
                    </span>
                  </div>
                  <div className="font-semibold text-white text-base">
                    {formData.full_name}
                  </div>
                </div>

                <div className="p-3 bg-bodyBackground/50 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <MdPhone className="text-secondaryColor text-xl" />
                    <span className="text-sm text-gray-400 font-medium">
                      Số điện thoại
                    </span>
                  </div>
                  <div className="font-semibold text-white text-base">
                    {formData.phone}
                  </div>
                </div>

                <div className="p-3 bg-bodyBackground/50 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <MdEmail className="text-secondaryColor text-xl" />
                    <span className="text-sm text-gray-400 font-medium">
                      Email
                    </span>
                  </div>
                  <div className="font-semibold text-white text-base">
                    {formData.email}
                  </div>
                </div>

                {/* Gộp ngày và giờ đặt bàn */}
                <div className="p-3 bg-bodyBackground/50 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <MdCalendarToday className="text-secondaryColor text-xl" />
                    <span className="text-sm text-gray-400 font-medium">
                      Ngày & Giờ đặt bàn
                    </span>
                  </div>
                  <div className="font-semibold text-white text-base">
                    {formData.date} - {formData.time}
                  </div>
                </div>

                <div className="p-3 bg-bodyBackground/50 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <FaUsers className="text-secondaryColor text-xl" />
                    <span className="text-sm text-gray-400 font-medium">
                      Số người
                    </span>
                  </div>
                  <div className="font-semibold text-white text-base">
                    {formData.number_of_people} người
                  </div>
                </div>

                <div className="p-3 bg-bodyBackground/50 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <MdChair className="text-secondaryColor text-xl" />
                    <span className="text-sm text-gray-400 font-medium">
                      Loại bàn
                    </span>
                  </div>
                  <div className="font-semibold text-white text-base">
                    {getTableTypeDisplayName(formData.tableCategory)}
                  </div>
                </div>

                {formData.note && (
                  <div className="md:col-span-2 lg:col-span-3 p-3 bg-bodyBackground/50 rounded-lg text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      {/* You can use an icon for note if you want, e.g. MdNote */}
                      <span className="text-sm text-gray-400 font-medium">
                        Ghi chú
                      </span>
                    </div>
                    <div className="font-semibold text-white text-base">
                      {formData.note}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Thông tin món ăn đã chọn */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-headerBackground/80 border border-secondaryColor/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-secondaryColor mb-6 flex items-center gap-2">
                <GiKnifeFork className="text-2xl" />
                Món ăn đã chọn ({formData.selectedItems.length} món)
              </h3>

              {formData.selectedItems.length > 0 ? (
                <>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {formData.selectedItems.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex justify-between items-center p-4 bg-bodyBackground/50 rounded-lg border border-secondaryColor/20 hover:border-secondaryColor/40 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-semibold text-white">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-400">
                              {item.category}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-secondaryColor font-semibold">
                            {fCurrency(item.price * item.quantity)}
                          </p>
                          <p className="text-sm text-gray-400">
                            {fCurrency(item.price)} x {item.quantity}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-secondaryColor/20 flex justify-between items-center">
                    <span className="text-gray-300 text-lg">
                      Tổng giá trị món ăn:
                    </span>
                    <span className="text-2xl font-bold text-secondaryColor">
                      {fCurrency(selectedFoodTotal)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <GiKnifeFork className="text-6xl text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Chưa chọn món ăn nào</p>
                  <p className="text-gray-500 text-sm">
                    Bạn có thể chọn món ăn sau khi đặt bàn
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Thông báo xác nhận */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="bg-gradient-to-br from-headerBackground/90 to-headerBackground/70 border-2 border-secondaryColor shadow-2xl rounded-xl p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondaryColor/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondaryColor/5 rounded-full translate-y-12 -translate-x-12"></div>

              <div className="relative z-10">
                <p className="text-lg text-gray-300 mb-3 font-medium tracking-wide">
                  Xác nhận thông tin đặt bàn
                </p>
                <div className="text-2xl font-bold text-secondaryColor mb-3 drop-shadow-lg">
                  Mọi thông tin đã chính xác?
                </div>
                <p className="text-sm text-gray-400 text-center max-w-md mx-auto">
                  Sau khi xác nhận, bạn sẽ được chuyển đến bước thanh toán đặt
                  cọc để hoàn tất việc đặt bàn.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Nút điều hướng */}
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
                disabled={isSubmitting}
              >
                Quay lại
              </ButtonComponents>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ButtonComponents
                variant="filled"
                size="small"
                onClick={handleConfirmReservation}
                disabled={isSubmitting}
                className="px-8 py-3 text-base font-bold shadow-lg hover:shadow-xl transition-all duration-200 min-w-[180px] flex items-center justify-center gap-2 bg-gradient-to-r from-secondaryColor to-secondaryColor/90"
              >
                {isSubmitting && (
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
                {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt bàn'}
              </ButtonComponents>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Step4Review;
