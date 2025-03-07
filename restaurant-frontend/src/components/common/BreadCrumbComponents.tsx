import React from "react";
import { useLocation, Link } from "react-router-dom";
import { MdOutlineNavigateNext } from "react-icons/md";
import { breadcrumbConfig } from "../../configs/breadcrumbConfig";

const BreadCrumbComponents = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const breadcrumbList = [
    { path: "/", label: "Trang chủ" },
    ...pathnames.map((value, index) => {
      const to = `/${pathnames.slice(0, index + 1).join("/")}`;
      return { path: to, label: breadcrumbConfig[to] || decodeURIComponent(value) };
    }),
  ];

  return (
    <nav
      aria-label="breadcrumb"
      className="py-4 bg-[url('/assets/images/wishlist/breadcrumb.jpg')] bg-cover bg-center h-[170px] flex justify-center items-center"
    >
      <div>
        <ol className="flex space-x-2 text-1xl text-gray-300">
          {breadcrumbList.map((item, index) => (
            <li key={item.path} className="flex items-center space-x-2">
              {index > 0 && <MdOutlineNavigateNext />}
              <Link
                to={item.path}
                className={`${index === breadcrumbList.length - 1 ? "font-semibold text-white hover:text-secondaryColor" : "hover:text-secondaryColor"}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default BreadCrumbComponents;
