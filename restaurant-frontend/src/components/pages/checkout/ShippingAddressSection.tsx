import React, { useEffect, useState } from 'react';
import ModalSelectAddress, { Address } from './ModalSelectAddress';
import { AddAddressModal } from '../address/AddAddressModal';
import { toast } from 'react-toastify'; 
import ModalSelectDeliveryTime, {
  DeliveryTime,
} from './ModalSelectDeliveryTime';

interface Props {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: (newAddr: Omit<Address, 'id'>) => void;
  onDeliveryTimeChange?: (deliveryTime: DeliveryTime) => void;
  initialDeliveryTime?: DeliveryTime;
  deliveryMethod?: 'delivery' | 'pickup';
  onDeliveryMethodChange?: (method: 'delivery' | 'pickup') => void;
  receiver?: string;
  receiverPhone?: string; 
  onReceiverChange?: (name: string, phone: string) => void;
  refetch: () => void;
}

const ShippingAddressSection = ({
  addresses,
  selectedId,
  onSelect,
  onAdd,
  onDeliveryTimeChange = () => {},
  initialDeliveryTime = { type: 'now' },
  deliveryMethod = 'delivery',
  onDeliveryMethodChange = () => {},
  receiver = '',
  receiverPhone = '',
  onReceiverChange = () => {},
  refetch,
}: Props) => {
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeliveryTimeModalOpen, setIsDeliveryTimeModalOpen] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState<DeliveryTime>(initialDeliveryTime);
  const [localReceiver, setLocalReceiver] = useState(receiver);
  const [localReceiverPhone, setLocalReceiverPhone] = useState(receiverPhone);

  const selected = addresses.find((addr) => addr.id === String(selectedId));

  useEffect(() => {
    if (!selectedId && addresses.length > 0) {
      const defaultAddr = addresses.find((a) => a.is_default);
      if (defaultAddr) {
        console.log('✅ Auto-select default:', defaultAddr.id);
        onSelect(defaultAddr.id); // 👈 đúng ID từ API
      }
    }
  }, [addresses, selectedId]);

  // Update local state when props change
  useEffect(() => {
    setLocalReceiver(receiver);
    setLocalReceiverPhone(receiverPhone);
  }, [receiver, receiverPhone]);

  const getFormattedAddress = (address: Address) => {
    return [
      address.street_address,
      address.ward,
      address.district,
      address.province,
    ]
      .filter(Boolean)
      .join(', ');
  };

  const handleOpenAddModal = () => {
    setIsSelectModalOpen(false);
    setIsAddModalOpen(true);
  };

  const handleSaveAddress = (
    province: string,
    district: string,
    ward: string,
    street_address: string,
    full_name: string,
    lat: number,
    lon: number,
    phone: string,
    addressType: string,
  ) => {
    onAdd({
      address_type: addressType,
      full_name,
      phone,
      province,
      district,
      ward,
      street_address,
      lat,
      lon,
      is_default: addresses.length === 0,
    });
    setIsAddModalOpen(false);
    toast.success('Đã thêm địa chỉ thành công');
    try {
      refetch();
    } catch (err) {
      console.error('⚠️ refetch lỗi hoặc không định nghĩa:', err);
    }
  };

  const handleDeliveryTimeSelect = (selectedTime: DeliveryTime) => {
    setDeliveryTime(selectedTime);
    onDeliveryTimeChange(selectedTime);
  };

  const getFormattedDeliveryTime = () => {
    if (deliveryTime.type === 'now') return 'Giao hàng ngay khi chuẩn bị xong';
    if (deliveryTime.type === 'scheduled' && deliveryTime.scheduledTime) {
      return `Giao vào ${deliveryTime.scheduledTime.toLocaleString('vi-VN', {
        weekday: 'long',
        day: 'numeric',
        month: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    }
    return 'Chưa chọn thời gian giao hàng';
  };

  return (
    <div className="border border-hr rounded-lg p-4 shadow-sm">
      <h2 className="font-semibold text-lg text-white mb-3">
        Phương Thức Nhận Hàng
      </h2>

      {/* Delivery method */}
      <div className="flex gap-4 mb-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="deliveryMethod"
            checked={deliveryMethod === 'delivery'}
            onChange={() => onDeliveryMethodChange('delivery')}
            className="mr-2"
          />
          <span>Giao hàng tận nơi</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="deliveryMethod"
            checked={deliveryMethod === 'pickup'}
            onChange={() => onDeliveryMethodChange('pickup')}
            className="mr-2"
          />
          <span>Đến lấy tại cửa hàng</span>
        </label>
      </div>

      {deliveryMethod === 'delivery' ? (
        <>
          <h3 className="font-semibold text-white mb-2">Địa Chỉ Nhận Hàng</h3>
          {addresses.length === 0 || !selected ? (
            <div className="text-sm text-white/50">
              Bạn chưa có địa chỉ nhận hàng.
              <span
                className="text-blue-500 underline cursor-pointer ml-1"
                onClick={handleOpenAddModal}
              >
                Thêm địa chỉ mới
              </span>
            </div>
          ) : (
            <>
              <p className="font-medium">
                {selected.full_name} ({selected.phone})
              </p>
              <p className="text-sm text-white/50">
                {getFormattedAddress(selected)}
                {selected.is_default && (
                  <span className="ml-2 px-1 text-red-500 border border-red-500 text-xs">
                    Mặc Định
                  </span>
                )}
                <span
                  onClick={() => setIsSelectModalOpen(true)}
                  className="ml-4 text-blue-500 cursor-pointer"
                >
                  Thay Đổi
                </span>
              </p>
            </>
          )}

          {/* Delivery time */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <h3 className="font-semibold text-white mb-2">
              Thời Gian Giao Hàng
            </h3>
            <div className="flex items-center">
              <p className="text-sm text-white/70">
                {getFormattedDeliveryTime()}
              </p>
              <p
                onClick={() => setIsDeliveryTimeModalOpen(true)}
                className="text-blue-500 mx-3 text-sm cursor-pointer"
              >
                Thay đổi
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <h3 className="font-semibold text-white mb-2">Địa chỉ nhận hàng</h3>
          <div className="text-white text-sm">
            Nhà Hàng BeefBeef – 161 Quốc Hương, Thảo Điền, Quận 2 (055 1234
            5678)
          </div>
          <div className="mt-4">
            <label className="block mb-1 text-sm text-white/70">
              Tên người nhận hàng
            </label>
            <input
              type="text"
              placeholder="Nhập tên người nhận"
              value={localReceiver}
              onChange={(e) => {
                setLocalReceiver(e.target.value);
                onReceiverChange(e.target.value, localReceiverPhone);
              }}
              className="w-full p-2 border border-white/20 rounded bg-transparent text-white focus:outline-none focus:border-blue-500"
            />
            <label className="block mt-3 mb-1 text-sm text-white/70">
              Số điện thoại người nhận hàng
            </label>
            <input
              type="text"
              placeholder="Nhập số điện thoại"
              value={localReceiverPhone}
              onChange={(e) => {
                setLocalReceiverPhone(e.target.value);
                onReceiverChange(localReceiver, e.target.value);
              }}
              className="w-full p-2 border border-white/20 rounded bg-transparent text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </>
      )}

      {/* Modals */}
      <ModalSelectAddress
        isOpen={isSelectModalOpen}
        onClose={() => setIsSelectModalOpen(false)}
        addresses={addresses}
        selectedId={selectedId ?? ''}
        onSelect={(id) => {
          onSelect(id);
          setIsSelectModalOpen(false);
        }}
        onAddAddress={handleOpenAddModal}
      />

      <ModalSelectDeliveryTime
        isOpen={isDeliveryTimeModalOpen}
        onClose={() => setIsDeliveryTimeModalOpen(false)}
        onSelect={handleDeliveryTimeSelect}
        currentSelection={deliveryTime}
      />

      <AddAddressModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveAddress}
        total={addresses.length}
      />
    </div>
  );
};

export default ShippingAddressSection;
