import React, { useEffect, useState } from "react";
import ProductInfoSection from "@components/pages/checkout/ProductInfoSection";
import ShippingAddressSection from "@components/pages/checkout/ShippingAddressSection";
import { Address } from "@components/pages/checkout/ModalSelectAddress";
import { Voucher } from "@components/pages/checkout/VoucherSelector";
import { DeliveryTime } from "@components/pages/checkout/ModalSelectDeliveryTime";
import { useGetCart } from "@hooks/useCart";
import { useNavigate } from "react-router-dom";

// Define a Product type to match the updated ProductInfoSection requirements
interface Product {
  image: string;
  name: string;
  price: number;
  discount_price?: number;
  quantity: number;
  category?: string;
  notes?: string;
}

const CheckoutPage = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shippingFee, setShippingFee] = useState<number>(25000);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [deliveryTime, setDeliveryTime] = useState<DeliveryTime>({ type: "now" });
  const [products, setProducts] = useState<Product[]>([]);
  const { data: cart } = useGetCart();
  const navigate = useNavigate();

  useEffect(() => {
    const selectedItemsStr = localStorage.getItem('selectedCartItems');
    
    if (selectedItemsStr) {
      try {
        const selectedItems = JSON.parse(selectedItemsStr);
        
        if (selectedItems && selectedItems.length > 0) {
          const formattedProducts: Product[] = selectedItems.map((item: any) => ({
            image: item.imageUrl,
            name: item.name,
            price: item.price, // Original price
            discount_price: item.discountedPrice, // Discounted price if available
            quantity: item.quantity,
            category: item.category || "",
            notes: item.notes || ""
          }));
          
          setProducts(formattedProducts);
        } else {
          navigate('/cart');
        }
      } catch (error) {
        console.error("Error parsing selected items:", error);
        navigate('/cart');
      }
    } else {
      // If no selected items are found, redirect to cart
      navigate('/cart');
    }
  }, [cart, navigate]);

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
    
    // Update shipping fee based on delivery time
    if (time.type === "scheduled") {
      // For scheduled deliveries, we might adjust the shipping fee
      // For example, express delivery might cost more
      setShippingFee(35000); // Higher fee for scheduled delivery
    } else {
      // Standard delivery fee for "now" type deliveries
      setShippingFee(25000);
    }
  };

  // Get the selected address to pass down to the ProductInfoSection component
  const selectedAddress = addresses.find(addr => addr.id === selectedId);

  // Handle proceeding to payment
  const handleProceedToPayment = () => {
    // Here you would implement the logic to proceed with payment
    // This could include validating the order, sending data to an API, etc.
    console.log("Processing payment with method:", paymentMethod);
    console.log("Shipping to address:", selectedAddress);
    console.log("Products:", products);
    
    // For demo purposes, show an alert
    alert("Đơn hàng đã được xác nhận! Đang chuyển hướng đến trang thanh toán...");
    
    // In a real implementation, you might navigate to a confirmation page or payment processor
    // navigate('/payment-confirmation');
  };

  return (
    <div className="flex py-10 bg-bodyBackground min-h-screen text-white">
      <div className="w-11/12 md:w-container95 lg:w-container90 xl:w-container85 2xl:w-mainContainer mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Thanh toán</h1>
        
        <ShippingAddressSection
          addresses={addresses}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAdd={handleAddAddress}
          deliveryTime={deliveryTime}
          onDeliveryTimeChange={handleDeliveryTimeChange}
        />        
       
        <ProductInfoSection
          products={products}
          note="Ít cay, không hành nha!"
          shippingFee={shippingFee}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          vouchers={vouchers}
          onProceedToPayment={handleProceedToPayment}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;