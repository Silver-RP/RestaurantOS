import React from "react";
import { useLocation, Link } from "react-router-dom";
import { MdOutlineNavigateNext } from "react-icons/md";
import { breadcrumbConfig } from "../../configs/breadcrumbConfig";

const BreadcrumbComponent = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const breadcrumbList = [
    { path: "/", label: "Trang chủ" },
    ...pathnames.map((value, index) => {
      const to = `/${pathnames.slice(0, index + 1).join("/")}`;
      return {
        path: to,
        label: breadcrumbConfig[to] || decodeURIComponent(value).replace(/[_-]/g, " "),
      };
    }),
  ];

  return (
    <nav
      aria-label="breadcrumb"
      className="py-4 bg-[url('/assets/images/wishlist/breadcrumb.jpg')] bg-cover bg-center 
                 flex justify-center items-center
                 h-[100px] lg:h-[140px] xl:h-[180px]"
    >
      <div>
        <ol className="flex items-center space-x-1 text-xs sm:text-sm md:text-base text-white font-medium">
          {breadcrumbList.map((item, index) => (
            <li key={item.path} className="flex items-center">
              {index > 0 && (
                <MdOutlineNavigateNext className="text-secondaryColor text-xl mx-1" />
              )}
              {index === breadcrumbList.length - 1 ? (
                <span className="text-white text-xl font-semibold">{item.label}</span>
              ) : (
                <Link
                  to={item.path}
                  className="hover:text-secondaryColor transition text-xl"
                >
                  {item.label}
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