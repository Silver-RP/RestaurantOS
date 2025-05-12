import React, { useEffect, useState } from "react";
import ProductInfoSection from "@components/pages/checkout/ProductInfoSection";
import ShippingAddressSection from "@components/pages/checkout/ShippingAddressSection";
import DeliveryTimeSection from "@components/pages/checkout/DeliveryTimeSection";
import { Address } from "@components/pages/checkout/ModalSelectAddress";
import { Voucher } from "@components/pages/checkout/VoucherSelector";
import { DeliveryTime } from "@components/pages/checkout/ModalSelectDeliveryTime";
import { useGetCart } from "@hooks/useCart";

const CheckoutPage = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shippingFee, setShippingFee] = useState<number>(25000);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [deliveryTime, setDeliveryTime] = useState<DeliveryTime>({ type: "now" });
  const { data: cart } = useGetCart();

  // const [products] = useState([
  //   {
  //     image: "/assets/images/products/SP5.jpg",
  //     name: "Bánh mì chả lụa",
  //     price: 20000,
  //     quantity: 2,
  //     category: "Bánh mì",
  //   },
  //   {
  //     image: "/assets/images/products/SP6.jpg",
  //     name: "Gỏi cuốn tôm thịt",
  //     price: 15000,
  //     quantity: 3,
  //     category: "Món khác",
  //   },
  // ]);

  const products = cart?.items?.map((item) => ({
    image: item.dishId.images[0],
    name: item.dishId.name,
    price: item.dishId.price,
    quantity: item.quantity,
    category: item.dishId.categories[0].Cate_name,
  }));

  const mockAddresses: Address[] = [{
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
    // Load addresses
    setAddresses(mockAddresses);
    setSelectedId(mockAddresses.find(addr => addr.isDefault)?.id || mockAddresses[0].id);
    
    // Set up vouchers
    setVouchers([
      {
        voucher_id: "VOUCHER123",
        code: "DISCOUNT10",
        discount_value: 10,
        start_date: "2025-01-01T00:00:00Z",
        end_date: "2025-12-31T23:59:59Z",
        limit: 1,
        description: "Giảm 10% tổng giá trị đơn hàng",
        min_total: 50000,
        max_value: 20000,
        type_discount: "percent",
      },
      {
        voucher_id: "VOUCHER124",
        code: "FREESHIP",
        discount_value: 25000,
        start_date: "2025-01-01T00:00:00Z",
        end_date: "2025-12-31T23:59:59Z",
        limit: 1,
        description: "Miễn phí vận chuyển",
        min_total: 40000,
        max_value: 25000,
        type_discount: "amount",
      },
    ]);
  }, []);

  const handleAddAddress = async (newAddr: Omit<Address, "id">) => {
    // Create a new address with an ID
    const newAddress: Address = {
      ...newAddr,
      id: addresses.length ? Math.max(...addresses.map(addr => addr.id)) + 1 : 1,
    };
    
    // Update addresses state
    setAddresses(prevAddresses => {
      // If the new address is marked as default, unmark others
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

  const handleDeliveryTimeChange = (time: DeliveryTime) => {
    setDeliveryTime(time);
    // Ở đây bạn có thể xử lý thêm logic khi thời gian giao hàng thay đổi
    // Ví dụ: tính lại phí vận chuyển dựa trên thời gian giao hàng
  };

  // Lấy địa chỉ đã chọn để truyền xuống component con (nếu cần)
  const selectedAddress = addresses.find(addr => addr.id === selectedId);

  return (
    <div className="flex py-10 bg-bodyBackground min-h-screen text-white">
      <div className="w-11/12 md:w-container95 lg:w-container90 xl:w-container85 2xl:w-mainContainer mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Thanh toán</h1>
        
        <ShippingAddressSection
          addresses={addresses}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAdd={handleAddAddress}
        />
        
        {/* Thêm DeliveryTimeSection ngay dưới phần địa chỉ */}
        <DeliveryTimeSection 
          initialDeliveryTime={deliveryTime}
          onDeliveryTimeChange={handleDeliveryTimeChange}
        />
        
        <ProductInfoSection
          products={products}
          note="Ít cay, không hành nha!"
          shippingFee={shippingFee}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          vouchers={vouchers}
          // selectedAddress={selectedAddress}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;