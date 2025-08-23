import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { breadcrumbConfig } from '../../configs/breadcrumbConfig';

const BreadcrumbComponent = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Hàm rút gọn text dài
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Hàm tạo label ngắn gọn cho mobile
  const getShortLabel = (label: string, isMobile: boolean) => {
    if (!isMobile) return label;

    // Rút gọn các từ phổ biến
    const shortLabels: { [key: string]: string } = {
      'Trang chủ': 'Trang chủ',
      'Thực đơn': 'Thực đơn',
      'Sản phẩm': 'SP',
      'Danh mục': 'DM',
      'Chi tiết': 'CT',
      'Giỏ hàng': 'Giỏ hàng',
      'Thanh toán': 'TT',
      'Đặt bàn': 'Đặt bàn',
      'Liên hệ': 'Liên hệ',
      'Về chúng tôi': 'Về chúng tôi',
      'Tin tức': 'Tin tức',
      'Khuyến mãi': 'KM',
      'Yêu thích': 'YT',
      'Đơn hàng': 'ĐH',
      'Tài khoản': 'TK',
    };

    return shortLabels[label] || truncateText(label, 8);
  };

  const breadcrumbList = [{ path: '/', label: 'Trang chủ' }];

  if (pathnames.length > 0) {
    pathnames.forEach((value, index) => {
      const to = `/${pathnames.slice(0, index + 1).join('/')}`;
      // Only map to matchedPath if found, otherwise leave undefined (do not default to '/')
      const matchedPath = breadcrumbConfig[to]
        ? to
        : Object.keys(breadcrumbConfig).find((key) => to.startsWith(key));
      const label =
        (matchedPath ? breadcrumbConfig[matchedPath] : undefined) ||
        decodeURIComponent(value).replace(/[_-]/g, ' ');
      // Skip pushing if to !== '/' but label is 'Trang chủ'
      if (to !== '/' && label === 'Trang chủ') return;
      breadcrumbList.push({ path: to, label });
    });
  }

  return (
    <nav
      aria-label="breadcrumb"
      className="sticky w-full top-0 z-20  py-2 sm:py-4 bg-[url('/assets/images/banner/breadcrumb01.jpg')] bg-cover bg-center 
             flex justify-center items-center
             h-[60px] sm:h-[80px] lg:h-[100px]"
    >
      <div className="absolute inset-0 bg-black bg-opacity-40 z-0" />

      <div className="relative z-10 px-4 w-full max-w-6xl">
        <ol className="flex items-center flex-wrap gap-1 text-xs sm:text-sm md:text-base text-white font-medium justify-center">
          {breadcrumbList.map((item, index) => (
            <li key={item.path} className="flex items-center flex-shrink-0">
              {index > 0 && (
                <MdOutlineNavigateNext className="text-secondaryColor text-lg sm:text-xl mx-1 flex-shrink-0" />
              )}
              {index === breadcrumbList.length - 1 ? (
                <span
                  className="text-white text-sm sm:text-base font-semibold"
                  title={item.label}
                >
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">
                    {getShortLabel(item.label, true)}
                  </span>
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="hover:text-secondaryColor transition text-sm sm:text-base"
                  title={item.label}
                >
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">
                    {getShortLabel(item.label, true)}
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default BreadcrumbComponent;
