import React, { useEffect, useState } from "react";
import ProductInfoSection from "@components/pages/checkout/ProductInfoSection";
import ShippingAddressSection from "@components/pages/checkout/ShippingAddressSection";
import { Address } from "@components/pages/checkout/ModalSelectAddress";

const CheckoutPage = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shippingFee, setShippingFee] = useState<number>(5000);

  const [products] = useState([
    {
      image: "/assets/images/products/SP5.jpg",
      name: "Bánh mì chả lụa",
      price: 20000,
      quantity: 2,
      category: "Bánh mì",
    },
    {
      image: "/assets/images/products/SP6.jpg",
      name: "Gỏi cuốn tôm thịt",
      price: 15000,
      quantity: 3,
      category: "Món khác",
    },
  ]);

  const mockAddresses: Address[] = [
    {
      id: 1,
      name: "Lâm Gia Bảo",
      phone: "0909123456",
      address: "123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",
      street: "123 Đường Lê Lợi",
      ward: "Phường Bến Thành",
      district: "Quận 1",
      city: "TP. Hồ Chí Minh",
      isDefault: true,
    },
    {
      id: 2,
      name: "Nguyễn Văn A",
      phone: "0911222333",
      address: "45 Nguyễn Trãi, Phường 7, Quận 5, TP. Hồ Chí Minh",
      street: "45 Nguyễn Trãi",
      ward: "Phường 7",
      district: "Quận 5",
      city: "TP. Hồ Chí Minh",
      isDefault: false,
    },
  ];

  useEffect(() => {
    setAddresses(mockAddresses);
    setSelectedId(mockAddresses[0].id);
  }, []);

  const handleAddAddress = async (newAddr: Omit<Address, "id">) => {
    // Create a new address with an ID
    const newAddress: Address = {
      ...newAddr,
      id: addresses.length ? Math.max(...addresses.map(addr => addr.id)) + 1 : 1,
    };
    
    // Update addresses state
    setAddresses(prevAddresses => {
      // If this is marked as default, unmark others
      if (newAddr.isDefault) {
        return [
          ...prevAddresses.map(addr => ({ ...addr, isDefault: false })),
          newAddress
        ];
      }
      return [...prevAddresses, newAddress];
    });
    
    // Select the new address
    setSelectedId(newAddress.id);
  };

  return (
    <div className="flex py-10 bg-bodyBackground min-h-auto text-white">
      <div className="w-11/12 md:w-container95 lg:w-container95 xl:w-container95 2xl:w-mainContainer mx-auto space-y-6">
        <ShippingAddressSection
          addresses={addresses}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAdd={handleAddAddress}
        />
        <ProductInfoSection
          products={products}
          note="Ít cay, không hành nha!"
          shippingFee={shippingFee}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;