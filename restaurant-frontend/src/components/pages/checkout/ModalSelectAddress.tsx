import React from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";

export interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  street?: string;
  ward?: string;
  district?: string;
  city?: string;
  isDefault?: boolean;
}

interface ModalSelectAddressProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[];
  selectedId: number;
  onSelect: (id: number) => void;
  onAddAddress: () => void;
}

const ModalSelectAddress = ({
  isOpen,
  onClose,
  addresses,
  selectedId,
  onSelect,
  onAddAddress,
}: ModalSelectAddressProps) => {
  // Format address string from address object parts if they exist
  const getFormattedAddress = (address: Address) => {
    // Check if address has street, ward, district, city format
    if ('street' in address && address.street && 
        'ward' in address && address.ward && 
        'district' in address && address.district && 
        'city' in address && address.city) {
      return `${address.street}, ${address.ward}, ${address.district}, ${address.city}`;
    }
    // Otherwise return the address string
    return address.address;
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg bg-bodyBackground rounded-lg px-6 py-10">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-bold text-white">
              Chọn Địa Chỉ Nhận Hàng
            </Dialog.Title>
            <button onClick={onClose} className="text-white">
              <IoClose className="text-xl" />
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {addresses.length === 0 ? (
              <p className="text-sm text-secondaryColor">Chưa có địa chỉ nào.</p>
            ) : (
              addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => onSelect(addr.id)}
                  className={`cursor-pointer border p-4 rounded-lg ${
                    selectedId === addr.id
                      ? "border-primary bg-headerBackground"
                      : "border-gray-300"
                  }`}
                >
                  <p className="font-semibold text-white">{addr.name}</p>
                  <p className="text-gray-300">{addr.phone}</p>
                  <p className="text-gray-300">{getFormattedAddress(addr)}</p>
                  {addr.isDefault && (
                    <span className="text-xs text-primary">[Mặc định]</span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Add Address Link */}
          <div className="mt-6 text-center">
            <span
              onClick={onAddAddress}
              className="text-primary cursor-pointer underline"
            >
              Thêm Địa Chỉ
            </span>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ModalSelectAddress;