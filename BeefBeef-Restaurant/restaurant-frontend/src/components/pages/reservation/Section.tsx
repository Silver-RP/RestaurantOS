import React from 'react';

interface SectionProps {
  menuItems: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    note?: string;
    category: string;
  }[];
}

const formatPrice = (price: number) =>
  price
    .toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    .replace('₫', 'VNĐ');

const Section: React.FC<SectionProps> = ({ menuItems }) => {
  const total = menuItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="w-full overflow-hidden">
      <div className="bg-bodyBackground border min-h-[500px] border-secondaryColor p-6 overflow-x-auto">
        <h2 className="text-2xl text-secondaryColor text-center border-b border-secondaryColor pb-4 mb-6">
          Danh sách món ăn
        </h2>

        {menuItems.length === 0 ? (
          <div className="flex flex-col justify-center h-[320px] items-center text-center py-10 animate-bounce-slow">
            <p className="text-3xl text-secondaryColor font-extrabold mb-2 flex items-center gap-2">
              <span className="animate-wiggle">Bạn chọn món tại nhà hàng</span>
            </p>
            <p className="text-gray-400 italic animate-fadeIn">
              Món ăn sẽ được chọn trực tiếp khi đến nơi
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 max-h-[320px] overflow-y-auto scrollbar-custom pr-2">
              {menuItems.map((dish, index) => (
                <div
                  key={dish.id + (dish.note || '')}
                  className={`flex items-center ${index === 0 ? 'pt-0 pb-4' : 'py-4'} 
                              ${index === menuItems.length - 1 ? '' : 'border-b border-secondaryColor'} min-h-[110px]`}
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-24 h-24 object-cover rounded-md border-2 border-secondaryColor mr-4"
                  />

                  <div className="flex-1 flex flex-col h-full">
                    <p className="font-semibold text-white text-left whitespace-nowrap overflow-hidden text-ellipsis">
                      {dish.name}
                    </p>
                    {dish.category && (
                      <p className="text-xs text-gray-400 italic text-left">
                        Phân loại: {dish.category}
                      </p>
                    )}
                    <p className="text-sm text-secondaryColor text-left">
                      {formatPrice(dish.price)}
                    </p>
                    {dish.note && (
                      <p className="text-sm text-gray-400 text-left italic mt-2">
                        Ghi chú: {dish.note}
                      </p>
                    )}
                  </div>

                  <div className="w-24 text-center">
                    <p className="text-sm text-white">SL: {dish.quantity}</p>
                  </div>

                  <div className="w-32 text-right">
                    <p className="text-sm text-secondaryColor whitespace-nowrap overflow-hidden text-ellipsis">
                      {formatPrice(dish.price * dish.quantity)}
                    </p>
                  </div>
                </div>
              ))}

              <div className="border-t border-secondaryColor mt-1"></div>
            </div>

            <div className="mt-6 text-right">
              <p className="text-lg text-secondaryColor">
                Tạm tính: {formatPrice(total)}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Section;
