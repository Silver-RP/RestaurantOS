import React, { useState, useEffect } from "react";
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
import ProductCard from "../global/ProductComponents";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  hoverImage?: string;
  isNew: boolean;
  discount?: string;
  cate?: string;
}

const products: Product[] = [
  { id: 1, name: "Olivas Rellenas", price: 120000, imageUrl: "/assets/images/products/SP1.jpg", hoverImage: "/assets/images/products/SP1.1.jpg", isNew: true, discount: "10% OFF", cate: "Appetizer" },
  { id: 2, name: "Fish Salad Asian", price: 110000, imageUrl: "/assets/images/products/SP1.jpg", hoverImage: "/assets/images/products/SP1.1.jpg", isNew: true, cate: "Salad" },
  { id: 3, name: "Greek Salad", price: 305000, originalPrice: 350000, imageUrl: "/assets/images/products/SP1.jpg", hoverImage: "/assets/images/products/SP1.1.jpg", isNew: true, cate: "Salad" },
  { id: 4, name: "Mixed Vegetable", price: 211000, imageUrl: "/assets/images/products/SP1.jpg", hoverImage: "/assets/images/products/SP1.1.jpg", isNew: true, cate: "Vegetable" },
  { id: 5, name: "Tomato Soup", price: 80000, imageUrl: "/assets/images/products/SP1.jpg", hoverImage: "/assets/images/products/SP1.1.jpg", isNew: true, cate: "Soup" },
  { id: 6, name: "Caesar Salad", price: 130000, imageUrl: "/assets/images/products/SP1.jpg", hoverImage: "/assets/images/products/SP1.1.jpg", isNew: true, cate: "Salad" },
  { id: 7, name: "Vegetable Soup", price: 95000, imageUrl: "/assets/images/products/SP1.jpg", hoverImage: "/assets/images/products/SP1.1.jpg", isNew: true, cate: "Soup" },
  { id: 8, name: "Chicken Soup", price: 150000, imageUrl: "/assets/images/products/SP1.jpg", hoverImage: "/assets/images/products/SP1.1.jpg", isNew: false, cate: "Soup" },
  { id: 9, name: "Grilled Fish", price: 250000, imageUrl: "/assets/images/products/SP1.jpg", hoverImage: "/assets/images/products/SP1.1.jpg", isNew: false, cate: "Main Course" },
  { id: 10, name: "Vegetable Stir Fry", price: 180000, imageUrl: "/assets/images/products/SP1.jpg", hoverImage: "/assets/images/products/SP1.1.jpg", isNew: false, cate: "Vegetable" },
  { id: 11, name: "Seafood Salad", price: 220000, imageUrl: "/assets/images/products/SP1.jpg", hoverImage: "/assets/images/products/SP1.1.jpg", isNew: false, cate: "Salad" },
];

const OrderOnlineSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [productsPerPage, setProductsPerPage] = useState<number>(4);

  useEffect(() => {
    const updateProductsPerPage = () => {
      if (window.innerWidth < 640) {
        setProductsPerPage(1); 
      } else if (window.innerWidth < 768) {
        setProductsPerPage(2);
      } else if (window.innerWidth < 1024) {
        setProductsPerPage(3); 
      } else {
        setProductsPerPage(4); 
      }
    };

    updateProductsPerPage();
    window.addEventListener("resize", updateProductsPerPage);

    return () => window.removeEventListener("resize", updateProductsPerPage);
  }, []);

  const getProductsForCurrentPage = () => {
    const startIndex = currentIndex * productsPerPage;
    return products.slice(startIndex, startIndex + productsPerPage);
  };

  const handleNavigation = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev" ? currentIndex - 1 : currentIndex + 1;
    const maxIndex = Math.ceil(products.length / productsPerPage) - 1;
    if (newIndex >= 0 && newIndex <= maxIndex) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <section className="bg-bodyBackground w-full text-white py-16">
      <div className="w-mainContainer mx-auto">
        <img
          src="/assets/images/home/IconOnline.svg"
          alt="Icon"
          className="mx-auto mb-8"
        />
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extralight font-restora mb-4">
            Đặt Món Trực Tuyến
          </h2>
          <p className="text-secondaryColor text-sm uppercase tracking-widest">
            Đề xuất của đầu bếp
          </p>
        </div>

        <div className="relative">
          <div className="flex transition-transform duration-500 ease-in-out">
            {getProductsForCurrentPage().map((product) => (
              <div
                key={product.id}
                className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-4 mb-4"
              >
                <ProductCard
                  name={product.name}
                  imageUrl={product.imageUrl}
                  hoverImage={product.hoverImage}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  discount={product.discount}
                  isNew={product.isNew}
                  cate={product.cate}
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => handleNavigation("prev")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 text-secondaryColor p-2"
            disabled={currentIndex === 0}
          >
            <BsArrowLeftCircle size={30} />
          </button>
          <button
            onClick={() => handleNavigation("next")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-secondaryColor p-2"
            disabled={currentIndex + productsPerPage >= products.length}
          >
            <BsArrowRightCircle size={30} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default OrderOnlineSection;
