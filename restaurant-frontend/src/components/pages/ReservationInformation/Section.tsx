import React from 'react';

const dishes = [
  { name: 'Bò bít tết nướng', quantity: 2, price: 250000 },
  { name: 'Mì Ý', quantity: 1, price: 250000 },
  { name: 'Tôm Hùm Hấp', quantity: 1, price: 250000 },
  { name: 'Gỏi Cá Châu Á', quantity: 1, price: 250000 },
  { name: 'Súp Bí Ngô', quantity: 1, price: 250000 },
];

const formatPrice = (price: number) =>
  price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'VNĐ');

const Section: React.FC = () => {
  const total = dishes.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="w-full md:w-2/3 lg:w-1/2 max-w-full overflow-hidden">
      {/* Khung danh sách món ăn */}
      <div className="bg-[#012B40] border border-[#FFDEA0] rounded-md p-6 overflow-x-auto">
        <h2 className="text-2xl text-[#FFDEA0] font-semibold text-center border-b border-[#FFDEA0] pb-4 mb-6">
          Danh sách món ăn
        </h2>

        <div className="grid gap-4">
          {dishes.map((dish, index) => (
            <div
              key={index}
              className={`flex items-center ${index === 0 ? 'pt-0 pb-4' : 'py-4'} 
                          ${index === 4 ? '' : 'border-b border-[#FFDEA0]'} min-h-[110px]`}
            >
              <img
                src={`/assets/images/ReservationInformation/image${index + 1}.svg`}
                alt={dish.name}
                className="w-24 h-24 object-cover rounded-md border-2 border-[#FFDEA0] mr-4"
              />

              <div className="flex-1 flex flex-col justify-center">
                <p className="font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis">
                  {dish.name}
                </p>
                <p className="text-xs text-gray-300">Món chính</p>
                <p className="text-sm text-[#FFDEA0]">{formatPrice(dish.price)}</p>
              </div>

              <div className="w-24 text-center">
                <p className="text-sm text-white">SL: {dish.quantity}</p>
              </div>

              <div className="w-32 text-right">
                <p className="text-sm text-[#FFDEA0] whitespace-nowrap overflow-hidden text-ellipsis">
                  {formatPrice(dish.price * dish.quantity)}
                </p>
              </div>
            </div>
          ))}

          {/* Thêm đường phân cách dưới "Súp Bí Ngô", giảm khoảng cách */}
          <div className="border-t border-[#FFDEA0] mt-1"></div>
        </div>

        <div className="mt-6 text-right">
          <p className="text-lg font-bold text-[#FFDEA0]">
            Tạm tính: {formatPrice(total)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Section;
