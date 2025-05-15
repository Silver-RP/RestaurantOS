import React, { useState } from "react";
import ModalSelectAddress, { Address } from "./ModalSelectAddress";
import { AddAddressModal } from "../address/AddAddressModal";
import ModalSelectDeliveryTime, {
  DeliveryTime,
} from "./ModalSelectDeliveryTime";

interface Props {
  addresses: Address[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onAdd: (newAddr: Omit<Address, "id">) => void;
  onDeliveryTimeChange?: (deliveryTime: DeliveryTime) => void;
  initialDeliveryTime?: DeliveryTime;
  deliveryMethod?: "delivery" | "pickup";
  onDeliveryMethodChange?: (method: "delivery" | "pickup") => void;
}

// Define delivery methods
type DeliveryMethod = "delivery" | "pickup";

const ShippingAddressSection = ({
  addresses,
  selectedId,
  onSelect,
  onAdd,
  onDeliveryTimeChange = () => { },
  initialDeliveryTime = { type: "now" },
  deliveryMethod = "delivery",
  onDeliveryMethodChange = () => { },
}: Props) => {
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeliveryTimeModalOpen, setIsDeliveryTimeModalOpen] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState<DeliveryTime>(initialDeliveryTime);

  const selected = addresses.find((addr) => addr.id === selectedId);

  const getFormattedAddress = (address: Address) => {
    if ('street' in address && 'ward' in address && 'district' in address && 'city' in address) {
      return `${address.street}, ${address.ward}, ${address.district}, ${address.city}`;
    }
    // Return the address string if it's already formatted
    return address.address;
  };

  const handleOpenAddModal = () => {
    setIsSelectModalOpen(false); // Close select modal if open
    setIsAddModalOpen(true); // Open add modal
  };

  const handleSaveAddress = (
    address: string,
    lat: number,
    lon: number,
    name: string,
    phone: string,
    addressType: string
  ) => {
    onAdd({
      name,
      phone,
      address,
      isDefault: addresses.length === 0,
    });
    setIsAddModalOpen(false);
  };

  const handleDeliveryTimeSelect = (selectedTime: DeliveryTime) => {
    setDeliveryTime(selectedTime);
    onDeliveryTimeChange(selectedTime);
  };

  // Format delivery time for display
  const getFormattedDeliveryTime = () => {
    if (deliveryTime.type === "now") {
      return "Giao hàng ngay khi chuẩn bị xong";
    } else if (deliveryTime.type === "scheduled" && deliveryTime.scheduledTime) {
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return `Giao vào ${deliveryTime.scheduledTime.toLocaleString("vi-VN", options)}`;
    }
    return "Chưa chọn thời gian giao hàng";
  };

  // Store locations (example data)
  const storeLocations = [
    { id: 1, name: "Nhà Hàng BeefBeef", address: "161 đường Quốc Hương, Thảo Điền, Quận 2", phone: "055 1234 5678" },
  ];

  return (
    <div className="border border-hr rounded-lg p-4 shadow-sm">
      <h2 className="font-semibold text-lg text-white mb-3">Phương Thức Nhận Hàng</h2>

      {/* Delivery method selection */}
      <div className="flex gap-4 mb-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="deliveryMethod"
            checked={deliveryMethod === "delivery"}
            onChange={() => onDeliveryMethodChange("delivery")}
            className="mr-2"
          />
          <span>Giao hàng tận nơi</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="deliveryMethod"
            checked={deliveryMethod === "pickup"}
            onChange={() => onDeliveryMethodChange("pickup")}
            className="mr-2"
          />
          <span>Đến lấy tại cửa hàng</span>
        </label>
      </div>

      {/* Show different content based on delivery method */}
      {deliveryMethod === "delivery" ? (
        <>
          <h3 className="font-semibold text-white mb-2">Địa Chỉ Nhận Hàng</h3>
          {addresses.length === 0 ? (
            <div className="text-sm text-white/50">
              Bạn chưa có địa chỉ nhận hàng.{" "}
              <span
                className="text-blue-500 underline cursor-pointer"
                onClick={() => setIsAddModalOpen(true)}
              >
                Thêm địa chỉ mới
              </span>
            </div>
          ) : (
            <>
              <p className="font-medium">
                {selected?.name} ({selected?.phone})
              </p>
              <p className="text-sm text-white/50">
                {selected && getFormattedAddress(selected)}
                {selected?.isDefault && (
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

          {/* Delivery Time Section */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <h3 className="font-semibold text-white mb-2">Thời Gian Giao Hàng</h3>
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
          <div className="space-y-4">
            {storeLocations.map((store) => (
              <div
                key={store.id}
                className=""
              >
                <p className="font-medium">{store.name}</p>
                <p className="text-sm text-white/50">{store.address} ({store.phone})</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal for selecting an address */}
      <ModalSelectAddress
        isOpen={isSelectModalOpen}
        onClose={() => setIsSelectModalOpen(false)}
        addresses={addresses}
        selectedId={selectedId ?? -1}
        onSelect={(id) => {
          onSelect(id);
          setIsSelectModalOpen(false);
        }}
        onAddAddress={handleOpenAddModal}
      />

      {/* Modal for selecting delivery time */}
      <ModalSelectDeliveryTime
        isOpen={isDeliveryTimeModalOpen}
        onClose={() => setIsDeliveryTimeModalOpen(false)}
        onSelect={handleDeliveryTimeSelect}
        currentSelection={deliveryTime}
      />

      {/* Modal for adding a new address */}
      <AddAddressModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveAddress}
      />
    </div>
  );
};

export default ShippingAddressSection;