import React, { useState } from 'react';
import ButtonComponents from '@/components/common/ButtonComponents';
import Modal from '@/components/common/ModalComponents';
import { toast } from 'react-toastify';

interface AddReservationItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (quantity: number, note: string) => void;
  itemName: string;
  itemPrice: number;
}

const AddReservationItemModal: React.FC<AddReservationItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  itemName,
  itemPrice,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  const handleConfirm = () => {
    if (quantity < 1) return;
    onSubmit(quantity, note);
    toast.success('Đã thêm vào đơn hàng!');
    onClose();
    setQuantity(1);
    setNote('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-white p-4 space-y-5">
        {/* Tên và giá */}
        <div className="space-y-1 text-center">
          <h3 className="text-lg">{itemName}</h3>
          <p className="text-secondaryColor font-medium">
            {itemPrice.toLocaleString()} VND
          </p>
        </div>

        {/* Số lượng */}
        <div>
          <label className="block text-sm text-left mb-1">Số lượng</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full p-2 rounded bg-transparent border border-gray-500 text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-secondaryColor"
          />
        </div>

        {/* Ghi chú */}
        <div>
          <label className="block text-left text-sm mb-1">Ghi chú thêm</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Ví dụ: ít cay, không hành..."
            className="w-full p-2 rounded bg-transparent border border-gray-500 text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-secondaryColor"
          />
        </div>

        {/* Nút xác nhận */}
        <div className="text-center pt-2">
          <ButtonComponents
            onClick={handleConfirm}
            variant="filled"
            size="medium"
            className="w-full"
          >
            XÁC NHẬN
          </ButtonComponents>
        </div>
      </div>
    </Modal>
  );
};

export default AddReservationItemModal;
