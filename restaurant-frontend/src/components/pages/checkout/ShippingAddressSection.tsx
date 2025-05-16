import React, { useEffect, useState } from 'react';
import ModalSelectAddress, { Address } from './ModalSelectAddress';
import { AddAddressModal } from '../address/AddAddressModal';
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
}: Props) => {


 
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeliveryTimeModalOpen, setIsDeliveryTimeModalOpen] = useState(false);
  const [deliveryTime, setDeliveryTime] =
    useState<DeliveryTime>(initialDeliveryTime);

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
    address: string,
    lat: number,
    lon: number,
    name: string,
    phone: string,
    addressType: string,
  ) => {
    onAdd({
      address_type: addressType,
      full_name: name,
      phone,
      province: address,
      district: address,
      ward: address,
      street_address: address,
      lat,
      lon,
      is_default: addresses.length === 0,
    });
    setIsAddModalOpen(false);
    refetch();
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
          <h3 className="font-semibold text-white mb-2">Nhà Hàng Nhận Hàng</h3>
          <div className="text-white text-sm">
            Nhà Hàng BeefBeef – 161 Quốc Hương, Thảo Điền, Quận 2 (055 1234
            5678)
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
      />
    </div>
  );
};

export default ShippingAddressSection;
