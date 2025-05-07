import React, { useState } from "react";
import ModalSelectAddress, { Address } from "./ModalSelectAddress";

interface Props {
  addresses: Address[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onAdd: (newAddr: Omit<Address, "id">) => void;
}

const ShippingAddressSection = ({
  addresses,
  selectedId,
  onSelect,
  onAdd,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const selected = addresses.find((addr) => addr.id === selectedId);

  return (
    <div className="border border-hr rounded-lg p-4 shadow-sm">
      <h2 className="font-semibold text-lg text-white">Địa Chỉ Nhận Hàng</h2>

      {addresses.length === 0 ? (
        <div className="text-sm text-gray-600">
          Bạn chưa có địa chỉ nhận hàng.{" "}
          <span
            className="text-blue-500 underline cursor-pointer"
            onClick={() => {
              setIsOpen(true);
              setIsAddingNew(true); 
            }}
          >
            Thêm địa chỉ mới
          </span>
        </div>
      ) : (
        <>
          <p className="font-medium">
            {selected?.name} ({selected?.phone})
          </p>
          <p className="text-sm text-gray-600">
            {selected?.address}
            {selected?.isDefault && (
              <span className="ml-2 px-1 text-red-500 border border-red-500 text-xs">
                Mặc Định
              </span>
            )}
            <span
              onClick={() => {
                setIsOpen(true);
                setIsAddingNew(false); 
              }}
              className="ml-4 text-blue-500 cursor-pointer"
            >
              Thay Đổi
            </span>
          </p>
        </>
      )}

      <ModalSelectAddress
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        addresses={addresses}
        selectedId={selectedId ?? -1}
        onSelect={(id) => {
          onSelect(id);
          setIsOpen(false);
        }}
        onAdd={onAdd}
        isAddingNew={isAddingNew} 
        setIsAddingNew={setIsAddingNew} 
      />
    </div>
  );
};

export default ShippingAddressSection;
