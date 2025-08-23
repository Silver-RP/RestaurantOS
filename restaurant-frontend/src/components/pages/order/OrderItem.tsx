import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Order, OrderItem, Status } from '@/types/Order.type';
import { useCancelOrder, useRequestReturn } from '@/hooks/useOrder';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { openOrderModal } from '@/redux/feature/modal/orderDetailModalSlice';

interface ReviewChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  onSelectItem: (slug: string) => void;
  title: string;
}

const ReviewChoiceModal: React.FC<ReviewChoiceModalProps> = ({
  isOpen,
  onClose,
  items,
  onSelectItem,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[120]">
      <div className="bg-bodyBackground rounded-xl shadow-2xl p-6 w-full max-w-md border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-secondaryColor">{title}</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl">
            &times;
          </button>
        </div>
        <ul className="space-y-3 max-h-96 overflow-y-auto">
          {items.map((item) => (
            <li
              key={item._id}
              onClick={() => onSelectItem(item.dish_slug || '')}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
            >
              <img
                src={item.dish_images?.[0] || '/placeholder-image.jpg'}
                alt={item.dish_name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <span className="font-semibold">{item.dish_name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


const statusColorMap: Record<Status, string> = {
  ORDER_PLACED: 'text-yellow-400 bg-yellow-400/10',
  ORDER_CONFIRMED: 'text-blue-400 bg-blue-400/10',
  PENDING_PICKUP: 'text-blue-400 bg-blue-400/10',
  PICKED_UP: 'text-purple-400 bg-purple-400/10',
  IN_TRANSIT: 'text-purple-400 bg-purple-400/10',
  DELIVERED: 'text-green-400 bg-green-400/10',
  CANCELLED: 'text-red-400 bg-red-400/10',
  RETURN_REQUESTED: 'text-orange-400 bg-orange-400/10',
  RETURN_APPROVED: 'text-orange-400 bg-orange-400/10',
  RETURN_REJECTED: 'text-red-400 bg-red-400/10',
  RETURNED: 'text-gray-400 bg-gray-400/10',
  DELIVERY_FAILED: 'text-red-400 bg-red-400/10',
};

interface ReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  title: string;
}

const ReasonModal: React.FC<ReasonModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
}) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error('Vui lòng nhập lý do');
      return;
    }
    onSubmit(reason);
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[120]">
      <div className="bg-bodyBackground rounded-xl shadow-2xl p-6 w-full max-w-md border border-white/10">
        <h2 className="text-xl font-bold mb-4 text-secondaryColor">{title}</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Nhập lý do..."
            className="w-full h-32 p-3 rounded-lg bg-[#14324a] text-white border border-white/20 focus:border-secondaryColor focus:outline-none resize-none"
          />
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-transparent border border-white/20 text-white hover:bg-white/10 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-secondaryColor text-headerBackground hover:bg-secondaryColor/90 rounded-lg"
            >
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface OrderItemProps {
  order: Order;
  reviewDate: string;
}

const OrderItemComponent: React.FC<OrderItemProps> = ({ order }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showMore, setShowMore] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [modalType, setModalType] = useState<'cancel' | 'return'>('cancel');
  const [showReviewChoiceModal, setShowReviewChoiceModal] = useState(false);

  const { mutate: cancelOrder } = useCancelOrder();
  const { mutate: requestReturn } = useRequestReturn();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    if (orderId) {
      dispatch(openOrderModal(orderId));
    }
  }, [searchParams]);

  const items = order.order_items || [];

  const handleCancel = (reason: string) => {
    cancelOrder({ orderId: order._id, reason });
    setShowReasonModal(false);
  };

  const handleRequestReturn = (reason: string) => {
    requestReturn({ orderId: order._id, reason });
    setShowReasonModal(false);
  };

  const openReasonModal = (type: 'cancel' | 'return') => {
    setModalType(type);
    setShowReasonModal(true);
  };

  const handleReasonSubmit = (reason: string) => {
    switch (modalType) {
      case 'cancel':
        handleCancel(reason);
        break;
      case 'return':
        handleRequestReturn(reason);
        break;
    }
  };

  const handleNavigateToDetail = (slug: string, review = false) => {
    navigate(`/foods/${slug}${review ? '?review=true' : ''}`);
  };
  const handleReorder = () => {
    if (!order.order_items?.length) {
      toast.error('Không có sản phẩm để đặt lại');
      return;
    }

    const reorderItems = order.order_items.map((item) => ({
      id: item.dish_id,
      name: item.dish_name,
      discountedPrice: item.unit_price,
      price: item.unit_price,
      quantity: item.quantity,
      imageUrl: item.dish_images?.[0] || '/placeholder-image.jpg',
      category: item.categories?.[0] || 'Không phân loại',
    }));

    localStorage.setItem('selectedCartItems', JSON.stringify(reorderItems));
    navigate('/checkout');
  };

  if (!items.length) {
    return (
      <div className="text-white">Không có sản phẩm trong đơn hàng này.</div>
    );
  }

  const orderCode = (order._id?.slice(-6) || '000000').toUpperCase();

  const getStatusTabName = (status: string | null | undefined): string => {
    const statusMap: Record<string, string> = {
      ORDER_PLACED: 'Chờ xác nhận',
      ORDER_CONFIRMED: 'Đã xác nhận',
      PENDING_PICKUP: 'Chờ lấy hàng',
      PICKED_UP: 'Đã lấy hàng',
      IN_TRANSIT: 'Đang giao hàng',
      DELIVERED: 'Đã giao hàng',
      CANCELLED: 'Đã hủy',
      RETURN_REQUESTED: 'Yêu cầu hoàn trả',
      RETURN_APPROVED: 'Đã duyệt hoàn trả',
      RETURN_REJECTED: 'Từ chối hoàn trả',
      RETURNED: 'Đã hoàn trả',
      DELIVERY_FAILED: 'Giao hàng thất bại',
    };

    return status ? statusMap[status] || 'Không xác định' : 'Không xác định';
  };

  const statusText = getStatusTabName(order.status);

  const normalizeItem = (item: OrderItem) => ({
    _id: item._id,
    name: item.dish_name,
    image: item.dish_images?.[0] || '/placeholder-image.jpg',
    category: item.categories?.[0] || 'Không phân loại',
    quantity: item.quantity,
    price: item.unit_price,
    total: item.total_amount,
    slug: item.dish_slug || '',
  });

  console.log('items', items);
  const normalized = items.map(normalizeItem);
  const [firstItem, ...others] = normalized;

  const calcTotal = order.total_price;

  return (
    <div className="relative text-white p-4 md:p-6 border border-white/10 rounded-md">
      {/* Mã đơn + Trạng thái */}
      <div className="flex justify-between md:text-sm mb-2">
        <span className="text-white/80 text-lg">
          Mã đơn: <span className="font-medium">{orderCode}</span>
        </span>
        <span
          className={`font-semibold px-3 py-1 rounded-full text-sm ${statusColorMap[order.status as Status]}`}
        >
          {statusText}
        </span>
      </div>

      {/* Sản phẩm đầu tiên */}
      <div className="border-y border-white/20 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center min-w-0 flex-grow">
          <img
            src={firstItem.image}
            alt={firstItem.name}
            className="w-20 h-20 object-cover rounded-md cursor-pointer"
            onClick={() => handleNavigateToDetail(firstItem.slug)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.jpg';
            }}
          />
          <div className="ml-4 min-w-0">
            <h2
              className="font-bold text-sm md:text-lg line-clamp-2 cursor-pointer hover:text-secondaryColor"
              onClick={() => handleNavigateToDetail(firstItem.slug)}
            >
              {firstItem.name}
            </h2>
            <p className="text-xs mt-1">Phân loại: {firstItem.category}</p>
            <p className="text-xs mt-1">x{firstItem.quantity}</p>
          </div>
        </div>
        <div className="text-right whitespace-nowrap">
          <p className="text-secondaryColor text-sm font-bold">
            {firstItem.total.toLocaleString()} VND
          </p>
        </div>
      </div>

      {/* Các sản phẩm còn lại */}
      {others.length > 0 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex items-center text-xs text-white/70 hover:underline"
          >
            {showMore ? 'Thu gọn' : 'Xem thêm'}{' '}
            {showMore ? (
              <FaChevronUp className="ml-1" />
            ) : (
              <FaChevronDown className="ml-1" />
            )}
          </button>
        </div>
      )}

      {showMore && (
        <div className="mt-4 space-y-4">
          {others.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center border-b border-white/10 pb-2 gap-4"
            >
              <div className="flex items-center flex-grow min-w-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md cursor-pointer"
                  onClick={() => handleNavigateToDetail(item.slug)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-image.jpg';
                  }}
                />
                <div className="ml-3 min-w-0">
                  <h3
                    className="font-semibold text-xs line-clamp-2 cursor-pointer hover:text-secondaryColor"
                    onClick={() => handleNavigateToDetail(item.slug)}
                  >
                    {item.name}
                  </h3>
                  <p className="text-[10px] mt-1">Phân loại: {item.category}</p>
                  <p className="text-[10px] mt-1">x{item.quantity}</p>
                </div>
              </div>
              <div className="text-right whitespace-nowrap">
                <p className="text-secondaryColor text-xs font-bold">
                  {item.total.toLocaleString()} VND
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tổng tiền */}
      <div className="mt-4 text-right">
        <span className="text-sm md:text-base font-medium">Tổng tiền: </span>
        <span className="text-secondaryColor text-base md:text-lg font-bold">
          {calcTotal.toLocaleString()} VND
        </span>
      </div>

      {/* Các nút hành động */}
      <div className="mt-3 flex justify-end flex-wrap gap-2">
        {order.status === 'ORDER_PLACED' && (
          <button
            className="px-4 py-1.5 text-xs bg-transparent border border-secondaryColor text-white font-normal font-sans hover:bg-secondaryColor hover:text-headerBackground focus:ring-bodyBackground active:bg-secondaryColor/90 active:text-headerBackground"
            onClick={() => openReasonModal('cancel')}
          >
            Hủy đơn hàng
          </button>
        )}

        {order.status === 'DELIVERED' &&
          order.delivered_at &&
          (() => {
            const deliveryTime = new Date(order.delivered_at);
            const now = new Date();
            const timeDiffInMinutes =
              (now.getTime() - deliveryTime.getTime()) / (1000 * 60);

            return timeDiffInMinutes <= 30 ? (
              <button
                className="px-4 py-1.5 text-xs bg-transparent border border-secondaryColor text-white font-normal font-sans hover:bg-secondaryColor hover:text-headerBackground focus:ring-bodyBackground active:bg-secondaryColor/90 active:text-headerBackground"
                onClick={() => openReasonModal('return')}
              >
                Yêu cầu hoàn trả
              </button>
            ) : null;
          })()}

        {order.status === 'RETURN_REQUESTED' && (
          <span className="px-4 py-1.5 text-xs bg-transparent border border-secondaryColor text-secondaryColor font-normal font-sans">
            ĐÃ YÊU CẦU HOÀN TRẢ
          </span>
        )}

        {order.status === 'DELIVERED' && (
          <button
            className="px-4 py-1.5 text-xs bg-transparent border border-secondaryColor text-white font-normal font-sans hover:bg-secondaryColor hover:text-headerBackground focus:ring-bodyBackground active:bg-secondaryColor/90 active:text-headerBackground"
            onClick={() => {
              if (items.length === 1) {
                handleNavigateToDetail(items[0].dish_slug || '', true);
              } else {
                setShowReviewChoiceModal(true);
              }
            }}
          >
            Đánh giá
          </button>
        )}
        
        {(order.status === 'DELIVERED' || order.status === 'RETURN_REJECTED') && (
          <button
            onClick={handleReorder}
            className="px-4 py-1.5 text-xs bg-transparent border border-secondaryColor text-white font-normal font-sans hover:bg-secondaryColor hover:text-headerBackground focus:ring-bodyBackground active:bg-secondaryColor/90 active:text-headerBackground"
          >
            MUA LẠI
          </button>
        )}

        <button
          className="px-4 py-1.5 text-xs bg-transparent border border-secondaryColor text-white font-normal font-sans hover:bg-secondaryColor hover:text-headerBackground focus:ring-bodyBackground active:bg-secondaryColor/90 active:text-headerBackground"
          onClick={() => dispatch(openOrderModal(order._id))}
        >
          Xem chi tiết
        </button>
      </div>

      {/* Modal nhập lý do */}
      <ReasonModal
        isOpen={showReasonModal}
        onClose={() => setShowReasonModal(false)}
        onSubmit={handleReasonSubmit}
        title={
          modalType === 'cancel'
            ? 'Lý do hủy đơn hàng'
            : 'Lý do yêu cầu hoàn trả'
        }
      />
      <ReviewChoiceModal
        isOpen={showReviewChoiceModal}
        onClose={() => setShowReviewChoiceModal(false)}
        items={items}
        onSelectItem={(slug) => {
          setShowReviewChoiceModal(false);
          handleNavigateToDetail(slug, true);
        }}
        title="Chọn món ăn để đánh giá"
      />
    </div>
  );
};

export default OrderItemComponent;
