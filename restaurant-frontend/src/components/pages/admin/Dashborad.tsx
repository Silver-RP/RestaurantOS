import React from 'react';
import classNames from 'classnames';
import {
  FaChartBar,
  FaShoppingCart,
  FaUsers,
  FaUtensils,
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { day: 'Th 2', orders: 32 },
  { day: 'Th 3', orders: 45 },
  { day: 'Th 4', orders: 38 },
  { day: 'Th 5', orders: 52 },
  { day: 'Th 6', orders: 40 },
  { day: 'Th 7', orders: 67 },
  { day: 'CN', orders: 50 },
];
// Custom Card components
export const Card = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={classNames(
        'rounded-xl shadow-md border bg-admincard border-adminborder',
        className,
      )}
      {...props}
    />
  );
};

export const CardContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={classNames('p-4', className)} {...props} />;
};

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-adminbg text-admintext p-6 space-y-6">
      <h1 className="text-3xl font-bold text-adminprimary">
        Beef Beef Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-adminsubtle">Tổng đơn hôm nay</p>
              <p className="text-2xl">128</p>
            </div>
            <FaShoppingCart className="w-6 h-6 text-adminprimary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-adminsubtle">Khách đặt bàn</p>
              <p className="text-2xl">46</p>
            </div>
            <FaUsers className="w-6 h-6 text-adminprimary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-adminsubtle">Món bán chạy</p>
              <p className="text-2xl">Bò Gác Sốt Mù Tạt</p>
            </div>
            <FaUtensils className="w-6 h-6 text-adminprimary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-adminsubtle">Doanh thu hôm nay</p>
              <p className="text-2xl">25.800.000đ</p>
            </div>
            <FaChartBar className="w-6 h-6 text-adminprimary" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-admincard rounded-xl p-6">
          <h2 className="text-xl mb-4 text-adminprimary">
            Đơn hàng gần đây
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-adminsubtle text-sm border-b border-adminborder">
                  <th className="py-2 px-4">Khách hàng</th>
                  <th className="py-2 px-4">Món</th>
                  <th className="py-2 px-4">Tổng tiền</th>
                  <th className="py-2 px-4">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-adminborder hover:bg-adminhover">
                  <td className="py-2 px-4">Nguyễn Thị Mai</td>
                  <td className="py-2 px-4">Spaghetti Truffle</td>
                  <td className="py-2 px-4">320.000đ</td>
                  <td className="py-2 px-4 text-admingreen">Đã giao</td>
                </tr>
                <tr className="border-b border-adminborder hover:bg-adminhover">
                  <td className="py-2 px-4">Trần Văn An</td>
                  <td className="py-2 px-4">Gà Quay Thảo Mộc</td>
                  <td className="py-2 px-4">280.000đ</td>
                  <td className="py-2 px-4 text-adminyellow">Đang giao</td>
                </tr>
                <tr className="hover:bg-adminhover">
                  <td className="py-2 px-4">Lê Thị Hồng</td>
                  <td className="py-2 px-4">Cơm Bò Sốt Tỏi Đen</td>
                  <td className="py-2 px-4">1.200.000đ</td>
                  <td className="py-2 px-4 text-adminred">Đã hủy</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-admincard rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-adminprimary">
            Thông báo hôm nay
          </h2>
          <ul className="space-y-3 text-sm text-adminsubtle">
            <li>🔔 3 bàn đặt trước lúc 19h00.</li>
            <li>🍽 Bếp trưởng vắng mặt, thay bởi chef phụ.</li>
            <li>🚚 Giao nguyên liệu lúc 16h từ nhà cung cấp A.</li>
            <li>🎉 Hôm nay là ngày kỷ niệm thành lập nhà hàng!</li>
          </ul>
        </div>
        <div className="bg-admincard rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-adminprimary">
            Top món bán chạy
          </h2>
          <ul className="text-sm text-adminsubtle space-y-2">
            <li>🥇 Bò Gác Sốt Mù Tạt — 120 phần</li>
            <li>🥈 Spaghetti Truffle — 95 phần</li>
            <li>🥉 Gà Quay Thảo Mộc — 88 phần</li>
          </ul>
        </div>
        <div className="bg-admincard rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-adminprimary">
            Sự kiện sắp tới
          </h2>
          <ul className="text-sm text-adminsubtle space-y-2">
            <li>📅 Workshop nấu món Âu — 10/05</li>
            <li>🎂 Sinh nhật đầu bếp trưởng — 12/05</li>
            <li>🏆 Đề cử quán quân món mới — 15/05</li>
          </ul>
        </div>
        <div className="bg-admincard rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-adminprimary">
            Thống kê đơn theo tuần
          </h2>
          <ResponsiveContainer width="100%" height={250}>
  <BarChart data={data}>
    <XAxis dataKey="day" stroke="#D1D5DB" />
    <YAxis stroke="#D1D5DB" />
    <Tooltip
      contentStyle={{
        backgroundColor: '#132628',
        border: 'none',
        borderRadius: '8px',
        color: '#F9E6B3',
        fontSize: '14px',
      }}
      labelStyle={{ color: '#D1D5DB' }}
    />
    <Bar dataKey="orders" fill="#F9E6B3" radius={[4, 4, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
