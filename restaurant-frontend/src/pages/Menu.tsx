import FilterSidebar from '../components/pages/menu/FilterSidebar';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import React, { useState } from 'react';
import ProductGrid from '../components/pages/menu/ProductGrid';
import Pagination from '../components/pages/menu/Pagination';
import { BsGridFill, BsListUl } from 'react-icons/bs';

const MenuPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <section className="bg-bodyBackground w-full min-h-screen text-white">
      <div className="w-full mx-auto">
        <BreadCrumbComponents />
      </div>

      <div className="w-mainContainer mx-auto flex gap-8 py-10">
        <aside className="w-1/4 hidden lg:block">
          <FilterSidebar />
        </aside>

        <main className="flex-1 space-y-8">
          <div className="flex flex-wrap justify-end items-center gap-4">
            <div className="relative">
              <select className="appearance-none bg-bodyBackground border border-gray-500 text-white rounded px-4 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-secondaryColor">
                <option value="relevance">Sắp xếp theo liên quan</option>
                <option value="priceLow">Giá thấp đến cao</option>
                <option value="priceHigh">Giá cao đến thấp</option>
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-secondaryColor">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-2 text-secondaryColor">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 border rounded ${viewMode === 'grid' ? 'bg-secondaryColor text-black' : ''}`}
              >
                <BsGridFill />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 border rounded ${viewMode === 'list' ? 'bg-secondaryColor text-black' : ''}`}
              >
                <BsListUl />
              </button>
            </div>
          </div>

          <ProductGrid viewMode={viewMode} />

          <div className="pt-8">
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </main>
      </div>
    </section>
  );
};

export default MenuPage;
