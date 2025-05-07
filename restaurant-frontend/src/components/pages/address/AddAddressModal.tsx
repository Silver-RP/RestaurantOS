import React, { useState } from 'react';
import { AddressInput } from './AddressInput';
import { MapDisplay } from './MapDisplay';

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: string, lat: number, lon: number, name: string, phone: string, addressType: string) => void;
}

export const AddAddressModal: React.FC<AddAddressModalProps> = ({ isOpen, onClose, onSave }) => {
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressType, setAddressType] = useState('home'); 
  const [isDefault, setIsDefault] = useState(false);

  const handleSelectLocation = (lat: number, lon: number, address: string) => {
    setLat(lat);
    setLon(lon);
    setAddress(address);
  };

  const handleSave = () => {
    if (address && lat && lon && name && phone) {
      onSave(address, lat, lon, name, phone, addressType);
      setAddress('');
      setLat(0);
      setLon(0);
      setName('');
      setPhone('');
      setAddressType('home');
      setIsDefault(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-bodyBackground p-6 rounded-lg w-4/12 border border-[#FFE0A0] max-h-[80vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-4xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold text-white mb-4">Thêm Địa Chỉ</h2>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="text-gray-400">Họ và Tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-2"
              placeholder="Nhập họ và tên"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-gray-400">Số Điện Thoại</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-transparent border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-2"
              placeholder="Nhập số điện thoại"
            />
          </div>

          {/* Address Input */}
          <AddressInput
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onSelectLocation={handleSelectLocation}
          />

          {/* Map Display */}
          {lat !== 0 && lon !== 0 && (
            <MapDisplay lat={lat} lon={lon} address={address} />
          )}

          {/* Address Type */}
          <div>
            <label className="text-gray-400">Loại Địa Chỉ</label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="addressType"
                  value="home"
                  checked={addressType === 'home'}
                  onChange={(e) => setAddressType(e.target.value)}
                  className="hidden"
                />
                <span
                  className={`px-6 py-2 rounded-md border border-gray-500 ${addressType === 'home' ? 'bg-secondaryColor text-black' : 'bg-bodyBackground text-white'}`}
                >
                  Nhà riêng
                </span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="addressType"
                  value="office"
                  checked={addressType === 'office'}
                  onChange={(e) => setAddressType(e.target.value)}
                  className="hidden"
                />
                <span
                  className={`px-6 py-2 rounded-md border border-gray-500 ${addressType === 'office' ? 'bg-secondaryColor text-black' : 'bg-bodyBackground text-white'}`}
                >
                  Văn phòng
                </span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="addressType"
                  value="other"
                  checked={addressType === 'other'}
                  onChange={(e) => setAddressType(e.target.value)}
                  className="hidden"
                />
                <span
                  className={`px-6 py-2 rounded-md border border-gray-500 ${addressType === 'other' ? 'bg-secondaryColor text-black' : 'bg-bodyBackground text-white'}`}
                >
                  Khác
                </span>
              </label>
            </div>
          </div>

          {/* Set as Default */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={() => setIsDefault(!isDefault)}
              id="isDefault"
              className="text-secondaryColor"
            />
            <label htmlFor="isDefault" className="text-white">Đặt làm địa chỉ mặc định</label>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-secondaryColor text-secondaryColor hover:bg-bodyBackground hover:text-white transition uppercase text-sm md:text-base"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 border border-secondaryColor text-headerBackground bg-secondaryColor hover:bg-bodyBackground hover:text-white transition uppercase text-sm md:text-base"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
