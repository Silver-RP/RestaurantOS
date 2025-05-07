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

  useEffect(() => {
    const fetchShippingFee = async () => {
      try {
        const res = await fetch("http://localhost:3000/shippingFee");
        const data = await res.json();
        setShippingFee(data.shippingFee || 5000); 
      } catch (error) {
        console.error("Failed to fetch shipping fee", error);
      }
    };

    fetchShippingFee();
  }, []);

  const handleAddAddress = async (newAddr: Omit<Address, "id">) => {
    try {
      const res = await fetch("http://localhost:3000/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddr),
      });

      const created = await res.json();
      setAddresses((prev) => [...prev, created]);
      setSelectedId(created.id);
    } catch (error) {
      console.error("Failed to add address", error);
    }
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
