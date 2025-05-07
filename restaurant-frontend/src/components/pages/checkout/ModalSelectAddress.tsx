import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";

export interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  isDefault?: boolean;
}

interface ModalSelectAddressProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[];
  selectedId: number;
  onSelect: (id: number) => void;
  onAdd: (newAddress: Omit<Address, "id">) => void;
  isAddingNew: boolean; 
  setIsAddingNew: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalSelectAddress = ({
  isOpen,
  onClose,
  addresses,
  selectedId,
  onSelect,
  onAdd,
  isAddingNew,
  setIsAddingNew,
}: ModalSelectAddressProps) => {
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address: "",
    isDefault: false,
  });

  const handleSubmit = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.address) return;
    onAdd(newAddress);
    setNewAddress({ name: "", phone: "", address: "", isDefault: false });
    setIsAddingNew(false);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg bg-bodyBackground rounded-lg px-6 py-10">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-bold">
              {isAddingNew ? "Thêm Địa Chỉ Mới" : "Chọn Địa Chỉ Nhận Hàng"}
            </Dialog.Title>
            <button onClick={onClose}>
              <IoClose className="text-xl" />
            </button>
          </div>

          {!isAddingNew ? (
            <>
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {addresses.map((addr) => (
                  <li
                    key={addr.id}
                    className={`p-3 border rounded-lg cursor-pointer ${
                      selectedId === addr.id ? "border-blue-500" : "border-gray-200"
                    }`}
                    onClick={() => onSelect(addr.id)}
                  >
                    <p className="font-medium">{addr.name} ({addr.phone})</p>
                    <p className="text-sm text-gray-600">{addr.address}</p>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setIsAddingNew(true)} 
                className="mt-4 text-blue-600 underline text-sm"
              >
                + Thêm địa chỉ mới
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Họ tên"
                value={newAddress.name}
                onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                className="w-full px-3 py-2 bg-transparent border rounded"
              />
              <input
                type="text"
                placeholder="Số điện thoại"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                className="w-full px-3 py-2 bg-transparent border rounded"
              />
              <input
                type="text"
                placeholder="Địa chỉ"
                value={newAddress.address}
                onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                className="w-full px-3 py-2 bg-transparent border rounded"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                  id="isDefault"
                  className="w-4 h-4"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-600">
                  Đặt làm địa chỉ mặc định
                </label>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="text-sm text-gray-500"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  className="text-sm text-white bg-blue-600 px-4 py-2 rounded"
                >
                  Lưu địa chỉ
                </button>
              </div>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ModalSelectAddress;
