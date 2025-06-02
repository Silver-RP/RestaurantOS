// ✅ Updated SearchModal with hover icons and view/order badges
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { closeSearchModal, setSearchQuery } from '../../redux/feature/modal/searchModalSlice';
import { fetchAllFoods } from '../../api/FoodApi';
import { FoodDetail } from '../../types/Dish.types';
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination';
import { FiEye, FiCheckSquare } from 'react-icons/fi';

const SearchModal: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector((state: RootState) => state.searchModal.isOpen);
  const query = useSelector((state: RootState) => state.searchModal.query);

  const [results, setResults] = useState<FoodDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);

  const debounceRef = useRef<number | null>(null);

  const handleFetch = async (searchQuery: string, pageNum = 1) => {
    setLoading(true);
    try {
      const res = await fetchAllFoods({ search: searchQuery, limit, page: pageNum });
      setResults(res.docs);
      setTotal(res.totalDocs);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (!query.trim()) {
        setResults([]);
        setTotal(0);
        return;
      }
      setPage(1);
      handleFetch(query, 1);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    handleFetch(query, newPage);
  };

  const handleClickItem = (slug: string) => {
    dispatch(closeSearchModal());
    navigate(`/foods/${slug}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#102f43] p-6 rounded-lg shadow-xl relative animate-fadeIn transition-all duration-300 ease-out">
        <button
          onClick={() => dispatch(closeSearchModal())}
          className="absolute top-4 right-4 text-white text-2xl hover:text-red-400 transition"
        >
          ×
        </button>

        <h2 className="text-2xl mb-4 text-center text-white">Tìm kiếm món ăn</h2>

        <input
          type="text"
          placeholder="Nhập tên món ăn..."
          className="w-full px-3 py-2 mb-4 text-black outline-none focus:ring-2 focus:ring-secondaryColor transition"
          value={query}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />

        {query && (
          <p className="text-sm text-gray-300 mb-4 text-center">
            Tìm thấy <strong>{total}</strong> kết quả
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <p className="col-span-full text-center text-gray-300">Đang tìm kiếm...</p>
          ) : results.length > 0 ? (
            results.map((item) => (
              <div
                key={item._id}
                onClick={() => handleClickItem(item.slug)}
                className="relative bg-[#0D3343] rounded overflow-hidden shadow hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
              >
                <div className="relative">
                  <img src={item.images?.[0]} alt={item.name} className="w-full h-40 object-cover" />

                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="bg-secondaryColor text-black text-[10px] font-semibold px-2 py-1 rounded-sm">
                      <FiEye className="inline-block w-3 h-3 mr-1" /> {item.views ?? 0}
                    </span>
                    <span className="bg-secondaryColor text-black text-[10px] font-semibold px-2 py-1 rounded-sm">
                      <FiCheckSquare className="inline-block w-3 h-3 mr-1" /> {item.ordered_count ?? 0}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg truncate text-white">{item.name}</h3>
                  <p className="text-secondaryColor mt-1">
                    {(item.discount_price || item.price).toLocaleString()} VND
                  </p>
                </div>
              </div>
            ))
          ) : null}
        </div>

        {total > 6 && (
          <div className="mt-6">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(total / limit)}
              onPageChange={handlePageChange}
              limit={limit}
              showLimit={false}
              onLimitChange={(newLimit) => {
                setLimit(newLimit);
                setPage(1);
                handleFetch(query, 1);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;