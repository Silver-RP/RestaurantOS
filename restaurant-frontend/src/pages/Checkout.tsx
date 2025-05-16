import React, { useEffect, useState } from 'react';
import ProductInfoSection from '@components/pages/checkout/ProductInfoSection';
import ShippingAddressSection from '@components/pages/checkout/ShippingAddressSection';
import { Address } from '@components/pages/checkout/ModalSelectAddress';
import { Voucher } from '@components/pages/checkout/VoucherSelector';
import { DeliveryTime } from '@components/pages/checkout/ModalSelectDeliveryTime';
import { useGetCart } from '@hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { useUserAddresses } from '@/hooks/useAddress';

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
  address?: {
    full_name: string;
    phone: string;
    street_address: string;
    ward: string;
    district: string;
    province: string;
  };
  payment_method: 'CASH' | 'BANKING' | 'VNPAY' | 'MOMO';
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
  shipping_fee: number;
  items_price: number;
  vat_amount: number;
  total_price: number;
  total_quantity: number;
}

const CheckoutPage = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [shippingFee, setShippingFee] = useState<number>(25000);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [deliveryTime, setDeliveryTime] = useState<DeliveryTime>({
    type: 'now',
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [orderNote, setOrderNote] = useState<string>('');
  const { data: cart } = useGetCart();
  const navigate = useNavigate();
  const { data: fetchedAddresses = [], refetch } = useUserAddresses();

  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>(
    'delivery',
  );

  useEffect(() => {
    const selectedItemsStr = localStorage.getItem('selectedCartItems');

    if (selectedItemsStr) {
      try {
        const selectedItems = JSON.parse(selectedItemsStr);
        console.log('Selected items from localStorage:', selectedItems);

        if (selectedItems && selectedItems.length > 0) {
          // Log the first item to see its structure
          console.log('Sample item structure:', selectedItems[0]);

          const formattedProducts: Product[] = selectedItems.map(
            (item: any) => {
              // Log each item's id to ensure it's correct
              console.log(`Processing item ${item.name} with id: ${item.id}`);

              return {
                image: item.imageUrl,
                name: item.name,
                discountedPrice: item.discountedPrice,
                price: item.price,
                quantity: item.quantity,
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
    fetchedAddresses.find((addr) => addr.is_default)?.id || fetchedAddresses[0]?.id || null,
  );

    setVouchers([
      {
        voucher_id: 'VOUCHER123',
        code: 'DISCOUNT10',
        discount_value: 10,
        start_date: '2025-01-01T00:00:00Z',
        end_date: '2025-12-31T23:59:59Z',
        limit: 1,
        description: 'Giảm 10% tổng giá trị đơn hàng',
        min_total: 50000,
        max_value: 20000,
        type_discount: 'percent',
      },
      {
        voucher_id: 'VOUCHER124',
        code: 'FREESHIP',
        discount_value: 25000,
        start_date: '2025-01-01T00:00:00Z',
        end_date: '2025-12-31T23:59:59Z',
        limit: 1,
        description: 'Miễn phí vận chuyển',
        min_total: 40000,
        max_value: 25000,
        type_discount: 'amount',
      },
    ]);
  }, [fetchedAddresses]);

  const handleAddAddress = async (newAddr: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...newAddr,
      id: addresses.length
        ? Math.max(...addresses.map((addr) => Number(addr.id))) + 1
        : 1,
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

    setSelectedId(newAddress.id);
  };

  const handleDeliveryTimeChange = (time: DeliveryTime) => {
    setDeliveryTime(time);

    // Only update shipping fee if not in pickup mode
    if (deliveryMethod !== 'pickup') {
      if (time.type === 'scheduled') {
        setShippingFee(35000);
      } else {
        setShippingFee(25000);
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

  const selectedAddress = addresses.find((addr) => addr.id === selectedId);

  useEffect(() => {
    if (deliveryMethod === 'pickup') {
      setShippingFee(0);
    } else {
      if (deliveryTime.type === 'scheduled') {
        setShippingFee(35000);
      } else {
        setShippingFee(25000);
      }
    }
  }, [deliveryMethod, deliveryTime.type]);

  const handleProceedToPayment = () => {
    // Verify address is selected when delivery is chosen
    if (!selectedAddress && deliveryMethod === 'delivery') {
      alert('Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    const items_price = products.reduce((sum, item) => {
      return sum + item.discountedPrice * item.quantity;
    }, 0);

    const vat_amount = Math.round(items_price * 0.08);

    const total_price = items_price + vat_amount + shippingFee;

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
    };

    if (selectedAddress) {
      orderData.address = {
        full_name: selectedAddress.full_name,
        phone: selectedAddress.phone,
        street_address: selectedAddress.street_address || '',
        ward: selectedAddress.ward || '',
        district: selectedAddress.district || '',
        province: selectedAddress.province || '',
      };
    }

    if (deliveryTime.type === 'scheduled' && deliveryTime.scheduledTime) {
      orderData.scheduled_time = deliveryTime.scheduledTime.toISOString();
    }

    localStorage.setItem('orderConfirmationData', JSON.stringify(orderData));

    navigate('/confirm');
  };

  return (
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
        />

        <ProductInfoSection
          products={products}
          note={orderNote}
          shippingFee={shippingFee}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          vouchers={vouchers}
          onProceedToPayment={handleProceedToPayment}
          onNoteChange={handleOrderNoteChange}
          onProductNoteChange={handleProductNotes}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;
