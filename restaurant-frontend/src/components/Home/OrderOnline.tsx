import React from "react";
import ProductCard from "../global/ProductComponents";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  isNew: boolean;
  isPack?: boolean;
}

const products: Product[] = [
  {
    id: 1,
    name: "Olivas Rellenas",
    price: "120.000",
    image: "/assets/images/product1.jpg",
    isNew: true,
  },
  {
    id: 2,
    name: "Fish Salad Asian",
    price: "110.000",
    image: "/assets/images/product2.jpg",
    isNew: true,
  },
  {
    id: 3,
    name: "Greek Salad",
    price: "305.000",
    image: "/assets/images/product3.jpg",
    isNew: true,
    isPack: true,
  },
  {
    id: 4,
    name: "Mixed Vegetable",
    price: "211.000",
    image: "/assets/images/product4.jpg",
    isNew: true,
  },
];

const OrderOnlineSection: React.FC = () => {
  return (
    <section className="bg-bodyBackground w-full text-white py-16">
      <div className="w-mainContainer mx-auto">
        <img src="/assets/images/home/IconOnline.svg" alt="Icon" className="mx-auto mb-8" />
        <div className="text-center mb-12">
            <h2 className="text-4xl font-extralight font-restora mb-4">Đặt Món Trực Tuyến</h2>
            <p className="text-secondaryColor text-sm uppercase tracking-widest">
            Đề xuất của đầu bếp
            </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
            <ProductCard key={product.id} {...product} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default OrderOnlineSection;