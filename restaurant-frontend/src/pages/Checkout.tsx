import React, { useEffect, useState } from 'react';
import ProductInfoSection from '@components/pages/checkout/ProductInfoSection';
import ShippingAddressSection from '@components/pages/checkout/ShippingAddressSection';
import { Address } from '@components/pages/checkout/ModalSelectAddress';
import { DeliveryTime } from '@components/pages/checkout/ModalSelectDeliveryTime';
import { useGetCart } from '@hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { useUserAddresses } from '@/hooks/useAddress';
import { toast } from 'react-toastify';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import { useUserVouchers } from '@/hooks/useVouchers';
import { UserVoucherDisplay } from '@/types/Voucher.type';
import { getLoyaltyAccountInfo } from '@/api/LoyaltyApi';


interface Product {
  image: string;
  name: string;
  discountedPrice: number;
  price: number;
  discount_price?: number;
  quantity: number;
  category?: string;
  notes?: string;
  dish_id?: string;
}

interface OrderData {
  address_id?: string | null;
  address?: {
    full_name: string;
    phone: string;
    street_address: string;
    ward: string;
    district: string;
    province: string;
  };
  payment_method:
    | 'CASH'
    | 'BANKING'
    | 'VNPAY'
    | 'MOMO'
    | 'MOMO_ATM'
    | 'CREDIT_CARD';
  delivery_type: 'DELIVERY' | 'PICKUP';
  items: Array<{
    dish_id: string;
    name: string;
    imageUrl: string;
    quantity: number;
    discountedPrice: number;
    price: number;
    note?: string;
  }>;
  order_type: 'ONLINE';
  delivery_time_type: 'ASAP' | 'SCHEDULED';
  scheduled_time?: string;
  note?: string;
  receiver?: string;
  receiver_phone?: string;
  shipping_fee: number;
  items_price: number;
  vat_amount: number;
  total_price: number;
  total_quantity: number;
  voucher_id?: string | null;
  discount_amount?: number;
}

const CheckoutPage = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>(
    'delivery',
  );
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [deliveryTime, setDeliveryTime] = useState<DeliveryTime>({
    type: 'now',
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [orderNote, setOrderNote] = useState<string>('');
  const [receiver, setReceiver] = useState<string>('');
  const [receiverPhone, setReceiverPhone] = useState<string>('');
  const { data: cart } = useGetCart();
  const navigate = useNavigate();
  const { data: fetchedAddresses = [], refetch } = useUserAddresses();
  const { data: userVouchers = [] } = useUserVouchers();
  const [selectedVoucher, setSelectedVoucher] = useState<UserVoucherDisplay | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [loyaltyDiscountPercent, setLoyaltyDiscountPercent] = useState<number>(0);

  useEffect(() => {
    const selectedItemsStr = localStorage.getItem('selectedCartItems');

    if (selectedItemsStr) {
      try {
        const selectedItems = JSON.parse(selectedItemsStr);

        if (selectedItems && selectedItems.length > 0) {
          const formattedProducts: Product[] = selectedItems.map(
            (item: Partial<Product> & { id: string; imageUrl: string }) => {
              return {
                image: item.imageUrl,
                name: item.name || '',
                discountedPrice: item.discountedPrice || 0,
                price: item.price || 0,
                quantity: item.quantity || 0,
                dish_id: item.id, // Use the id field from selectedCartItems
                category: item.category || '',
                notes: item.notes || '',
              };
            },
          );

          setProducts(formattedProducts);
        } else {
          navigate('/cart');
        }
      } catch (error) {
        console.error('Error parsing selected items:', error);
        navigate('/cart');
      }
    } else {
      navigate('/cart');
    }
  }, [cart, navigate]);

  useEffect(() => {
    setAddresses(fetchedAddresses);
    setSelectedId(
      fetchedAddresses.find((addr) => addr.is_default)?._id ||
        fetchedAddresses[0]?._id ||
        null,
    );
  }, [fetchedAddresses]);

  useEffect(() => {
    // Lấy loyalty discount percent
    getLoyaltyAccountInfo().then((info) => {
      setLoyaltyDiscountPercent(info?.current_tier?.discount || 0);
    }).catch(() => setLoyaltyDiscountPercent(0));
  }, []);

  const handleAddAddress = async (newAddr: Omit<Address, '_id'>) => {
    const newAddress: Address = {
      ...newAddr,
      _id: crypto.randomUUID(), // generate a temporary string ID
    };

    setAddresses((prevAddresses) => {
      if (newAddr.is_default) {
        return [
          ...prevAddresses.map((addr) => ({ ...addr, is_default: false })),
          newAddress,
        ];
      }
      return [...prevAddresses, newAddress];
    });

    setSelectedId(newAddress._id);
  };

  const handleDeliveryTimeChange = (time: DeliveryTime) => {
    setDeliveryTime(time);

    // Only update shipping fee if not in pickup mode
    if (deliveryMethod !== 'pickup') {
      if (time.type === 'scheduled') {
        setShippingFee(50000);
      } else {
        setShippingFee(30000);
      }
    }
  };

  const handleOrderNoteChange = (note: string) => {
    setOrderNote(note);
  };

  const handleProductNotes = (productIndex: number, note: string) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex] = {
      ...updatedProducts[productIndex],
      notes: note,
    };
    setProducts(updatedProducts);
  };
  const selectedAddress = addresses.find((addr) => addr._id === selectedId || addr.id === selectedId);

  const handleVoucherChange = (voucher: UserVoucherDisplay | null) => {
    setSelectedVoucher(voucher);
    if (voucher && voucher.user_voucher_id) {
      // Tính discountAmount giống logic ở ProductInfoSection
      let discount = 0;
      const items_price = products.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0);
      if (voucher.discount_type === 'fixed') {
        discount = voucher.discount_value;
      } else if (voucher.discount_type === 'percent') {
        discount = (items_price * voucher.discount_value) / 100;
        if (voucher.max_discount_value) {
          discount = Math.min(discount, voucher.max_discount_value);
        }
      }
      setDiscountAmount(discount);
    } else {
      setDiscountAmount(0);
    }
  };

  const handleProceedToPayment = () => {
    if (!selectedAddress && deliveryMethod === 'delivery') {
      toast.error('Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    // Verify receiver info when pickup is chosen
    if (deliveryMethod === 'pickup') {
      if (!receiver || !receiverPhone) {
        toast.error('Vui lòng nhập thông tin người nhận');
        return;
      }
      if (!/^(0|\+84)[2|3|5|7|8|9][0-9]{8}$/.test(receiverPhone)) {
        toast.error('Số điện thoại không đúng định dạng');
        return;
      }
    }

    if (!paymentMethod) {
      toast.error('Vui lòng chọn phương thức thanh toán');
      return;
    }

    const items_price = products.reduce((sum, item) => {
      return sum + item.discountedPrice * item.quantity;
    }, 0);

    const vat_amount = Math.round(items_price * 0.08);

    const total_price = items_price + vat_amount + shippingFee - discountAmount;

    const total_quantity = products.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );   

    const orderData: OrderData = {
      payment_method: paymentMethod as 'CASH' | 'BANKING' | 'VNPAY' | 'MOMO',
      delivery_type: deliveryMethod === 'delivery' ? 'DELIVERY' : 'PICKUP',
      items: products.map((product) => ({
        dish_id: product.dish_id || '',
        name: product.name,
        imageUrl: product.image,
        quantity: product.quantity,
        discountedPrice: product.discountedPrice,
        price: product.price,
        note: product.notes,
      })),
      order_type: 'ONLINE',
      delivery_time_type: deliveryTime.type === 'now' ? 'ASAP' : 'SCHEDULED',
      note: orderNote,
      shipping_fee: shippingFee,
      items_price,
      vat_amount,
      total_price,
      total_quantity,
      voucher_id: selectedVoucher?._id || null,
      discount_amount: discountAmount,
    };    if (deliveryMethod === 'delivery') {
      if (selectedAddress) {
        orderData.address_id = selectedAddress._id || selectedAddress.id,
        orderData.address = {
          full_name: selectedAddress.full_name,
          phone: selectedAddress.phone,
          street_address: selectedAddress.street_address || '',
          ward: selectedAddress.ward || '',
          district: selectedAddress.district || '',
          province: selectedAddress.province || '',
        };
      }
    }

    if (deliveryMethod === 'pickup') {
      orderData.receiver = receiver;
      orderData.receiver_phone = receiverPhone;
    }

    if (deliveryTime.type === 'scheduled' && deliveryTime.scheduledTime) {
      orderData.scheduled_time = deliveryTime.scheduledTime.toISOString();
    }

    localStorage.setItem('orderConfirmationData', JSON.stringify(orderData));

    navigate('/confirm');
  };

  return (
    <>
      <BreadCrumbComponents />
      <div className="flex py-10 bg-bodyBackground min-h-screen text-white">
        <div className="w-11/12 md:w-container95 lg:w-container90 xl:w-container85 2xl:w-mainContainer mx-auto space-y-6">
          <h1 className="text-2xl font-bold">Thanh toán</h1>

          <ShippingAddressSection
            addresses={addresses}
            refetch={refetch}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onAdd={handleAddAddress}
            onDeliveryTimeChange={handleDeliveryTimeChange}
            initialDeliveryTime={deliveryTime}
            deliveryMethod={deliveryMethod}
            onDeliveryMethodChange={setDeliveryMethod}
            receiver={receiver}
            receiverPhone={receiverPhone}
            onReceiverChange={(name, phone) => {
              setReceiver(name);
              setReceiverPhone(phone);
            }}
          />

          <ProductInfoSection
            products={products}
            note={orderNote}
            shippingFee={shippingFee}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={(method) => setPaymentMethod(method || '')}
            vouchers={userVouchers as UserVoucherDisplay[]}
            onProceedToPayment={handleProceedToPayment}
            onNoteChange={handleOrderNoteChange}
            onProductNoteChange={handleProductNotes}
            onVoucherChange={handleVoucherChange}
            loyaltyDiscountPercent={loyaltyDiscountPercent}
          />
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
