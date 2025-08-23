import React, { useEffect, useState } from 'react';
import ModalSelectAddress from './ModalSelectAddress';
import { Address } from '@/types/Address.type';
import { AddAddressModal } from '../address/AddAddressModal';
import { toast } from 'react-toastify';
import ModalSelectDeliveryTime, {
  DeliveryTime,
} from './ModalSelectDeliveryTime';
import ModalSelectPickupTime, { PickupTime } from './ModalSelectPickupTime';

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
  onValidationRef?: (validateFn: () => boolean) => void;
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
  onValidationRef = () => {},
}: Props) => {
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeliveryTimeModalOpen, setIsDeliveryTimeModalOpen] = useState(false);

  const [deliveryTime, setDeliveryTime] =
    useState<DeliveryTime>(initialDeliveryTime);
  const [localReceiver, setLocalReceiver] = useState(receiver);
  const [localReceiverPhone, setLocalReceiverPhone] = useState(receiverPhone);

  // Validation states
  const [receiverError, setReceiverError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [pickupTimeError, setPickupTimeError] = useState(false);

  const selected = addresses.find((addr) => addr.id === String(selectedId));

  useEffect(() => {
    if (!selectedId && addresses.length > 0) {
      const defaultAddr = addresses.find((a) => a.is_default);
      if (defaultAddr) {
        console.log('✅ Auto-select default:', defaultAddr.id);
        onSelect(defaultAddr.id);
      }
    }
  }, [addresses, selectedId]);

  // Update local state when props change
  useEffect(() => {
    setLocalReceiver(receiver);
    setLocalReceiverPhone(receiverPhone);
  }, [receiver, receiverPhone]);

  // Validation functions
  const validatePhone = (phone: string): boolean => {
    // Vietnamese phone number regex
    const phoneRegex = /^(0|\+84)[2|3|5|7|8|9][0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateReceiver = (name: string): boolean => {
    return name.trim().length > 0;
  };

  const handleReceiverChange = (value: string) => {
    setLocalReceiver(value);

    // Validate on change
    if (receiverError && value.trim().length > 0) {
      setReceiverError(false);
    }

    onReceiverChange(value, localReceiverPhone);
  };

  const handlePhoneChange = (value: string) => {
    setLocalReceiverPhone(value);

    // Validate on change
    if (phoneError && validatePhone(value)) {
      setPhoneError(false);
    }

    onReceiverChange(localReceiver, value);
  };

  const handleReceiverBlur = () => {
    if (!validateReceiver(localReceiver)) {
      setReceiverError(true);
    }
  };

  const handlePhoneBlur = () => {
    if (localReceiverPhone.trim() === '') {
      setPhoneError(true);
    } else if (!validatePhone(localReceiverPhone)) {
      setPhoneError(true);
    }
  };
  // Public validation method that parent can call
  const validatePickupInfo = (): boolean => {
    let isValid = true;

    if (!validateReceiver(localReceiver)) {
      setReceiverError(true);
      isValid = false;
    }

    if (localReceiverPhone.trim() === '') {
      setPhoneError(true);
      isValid = false;
    } else if (!validatePhone(localReceiverPhone)) {
      setPhoneError(true);
      isValid = false;
    }

    // Remove pickup time validation since we always have a default time
    setPickupTimeError(false);

    return isValid;
  };

  // Expose validation function to parent via ref
  React.useEffect(() => {
    onValidationRef(validatePickupInfo);
  }, [
    localReceiver,
    localReceiverPhone,
    deliveryTime,
    deliveryMethod,
    onValidationRef,
  ]);
  const getProvinceName = (code?: string) => {
    if (!code) return '';
    if (code === '79') return 'TP. Hồ Chí Minh';
    return code;
  };
  const getFormattedAddress = (address: Address) => {
    return [
      address.street_address,
      address.ward,
      address.district,
      address.province ? getProvinceName(address.province) : '',
    ]
      .filter(Boolean)
      .join(', ');
  };

  const handleOpenAddModal = () => {
    setIsSelectModalOpen(false);
    setIsAddModalOpen(true);
  };

  const handleSaveAddress = (
    ward: string,
    province: string,
    street_address: string,
    full_name: string,
    phone: string,
    addressType: string,
  ) => {
    onAdd({
      address_type: addressType as 'HOME' | 'WORK' | 'OTHER',
      full_name,
      phone,
      province,
      district: '',
      ward,
      street_address,
      is_default: addresses.length === 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
    const isPickup = deliveryMethod === 'pickup';

    if (deliveryTime.type === 'now') {
      return isPickup
        ? 'Dự kiến nhận hàng trong 30-45 phút tính từ lúc đặt hàng.'
        : 'Dự kiến nhận hàng trong 45-90 phút tính từ lúc đặt hàng.';
    }

    if (deliveryTime.type === 'scheduled' && deliveryTime.scheduledTime) {
      return `${isPickup ? 'Nhận hàng' : 'Giao'} vào ${deliveryTime.scheduledTime.toLocaleString(
        'vi-VN',
        {
          weekday: 'long',
          day: 'numeric',
          month: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        },
      )}`;
    }

    return isPickup
      ? 'Chưa chọn thời gian nhận hàng'
      : 'Chưa chọn thời gian giao hàng';
  };

  return (
    <div className="border border-hr rounded-lg p-4 shadow-sm">
      <h2 className="font-semibold text-lg text-white mb-3">
        Phương Thức Nhận Hàng
      </h2>
      {/* Delivery method */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
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
                Thêm mới
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
                  <span className="ml-2 px-0 sm:px-1 text-red-500 border border-red-500 text-xs">
                    Mặc Định
                  </span>
                )}
                <span
                  onClick={() => setIsSelectModalOpen(true)}
                  className=" ml-0 sm:ml-4 text-blue-500 cursor-pointer"
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
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-white/70">
                {getFormattedDeliveryTime()}
              </p>
              <p
                onClick={() => setIsDeliveryTimeModalOpen(true)}
                className="text-blue-500 text-sm cursor-pointer whitespace-nowrap"
              >
                Thay đổi
              </p>
            </div>
            <p className="text-xs text-white/50 mt-1">
              (<span className="text-red-400">*</span>Thời gian thực tế có thể
              thay đổi tùy vào lưu lượng đơn hàng và tình trạng bếp.)
            </p>
          </div>
        </>
      ) : (
        <>
          <h3 className="font-semibold text-white mb-2">Địa chỉ nhận hàng</h3>
          <div className="text-white text-sm">
            Nhà Hàng BeefBeef – 161 Quốc Hương, Thảo Điền, Quận 2
            <br />
            <span className="font-semibold">SĐT: 023 999 1255</span>
          </div>

          <div className="mt-4">
            <label className="block mb-1 text-sm text-white/70">
              Tên người nhận hàng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Nhập tên người nhận"
              value={localReceiver}
              onChange={(e) => handleReceiverChange(e.target.value)}
              onBlur={handleReceiverBlur}
              className={`w-full p-2 border rounded bg-transparent text-white focus:border-secondaryColor focus:outline-none ${
                receiverError
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-white/20 focus:border-blue-500'
              }`}
            />
            {receiverError && (
              <p className="text-red-500 text-xs mt-1">
                Vui lòng nhập tên người nhận hàng
              </p>
            )}

            <label className="block mt-3 mb-1 text-sm text-white/70">
              Số điện thoại người nhận hàng{' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Nhập số điện thoại"
              value={localReceiverPhone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              onBlur={handlePhoneBlur}
              className={`w-full p-2 border rounded bg-transparent text-white focus:border-secondaryColor focus:outline-none ${
                phoneError
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-white/20 focus:border-blue-500'
              }`}
            />
            {phoneError && (
              <p className="text-red-500 text-xs mt-1">
                {localReceiverPhone.trim() === ''
                  ? 'Vui lòng nhập số điện thoại người nhận hàng'
                  : 'Số điện thoại không đúng định dạng'}
              </p>
            )}

            {/* Delivery time for pickup orders */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <h3 className="font-semibold text-white mb-2">
                Đặt giờ đến nhận hàng
              </h3>
              <div className="flex items-center">
                <p className="text-sm text-white/70">
                  {getFormattedDeliveryTime()}
                </p>
                <p
                  onClick={() => setIsDeliveryTimeModalOpen(true)}
                  className="text-blue-500 mx-3 text-sm cursor-pointer whitespace-nowrap"
                >
                  Chọn giờ
                </p>
              </div>
              {pickupTimeError && (
                <p className="text-red-500 text-xs mt-1">
                  Vui lòng chọn thời gian nhận hàng
                </p>
              )}
              <p className="text-xs text-white/50 mt-1">
                (<span className="text-red-400">*</span>Thời gian thực tế có thể
                thay đổi tùy vào lưu lượng đơn hàng và tình trạng bếp.)
              </p>
            </div>
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
      />{' '}
      {/* Show different time selection modal based on delivery method */}
      {deliveryMethod === 'delivery' ? (
        <ModalSelectDeliveryTime
          isOpen={isDeliveryTimeModalOpen}
          onClose={() => setIsDeliveryTimeModalOpen(false)}
          onSelect={handleDeliveryTimeSelect}
          currentSelection={deliveryTime}
        />
      ) : (
        <ModalSelectPickupTime
          isOpen={isDeliveryTimeModalOpen}
          onClose={() => setIsDeliveryTimeModalOpen(false)}
          onSelect={
            handleDeliveryTimeSelect as (pickupTime: PickupTime) => void
          }
          currentSelection={deliveryTime as PickupTime}
        />
      )}
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
