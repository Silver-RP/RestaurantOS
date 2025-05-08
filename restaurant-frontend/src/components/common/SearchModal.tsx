import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { closeSearchModal, setSearchQuery } from '../../redux/feature/searchModal/searchModalSlice';
import { fetchAllFoods } from '../../api/FoodApi';
import { FoodDetail } from '../../types/Dish.types';
import { useNavigate } from 'react-router-dom';

const SearchModal: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector((state: RootState) => state.searchModal.isOpen);
  const query = useSelector((state: RootState) => state.searchModal.query);

  const [results, setResults] = useState<FoodDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleFetch = async (searchQuery: string, pageNum = 1) => {
    setLoading(true);
    try {
      const res = await fetchAllFoods({ search: searchQuery, limit: 6, page: pageNum });
      setResults(res.docs);
      setTotal(res.totalDocs);
      setHasNextPage(res.hasNextPage);
      setHasPrevPage(res.hasPrevPage);
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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#102f43] p-6 rounded-lg shadow-xl relative">
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
          className="w-full p-3 mb-4 rounded-lg text-black outline-none focus:ring-2 focus:ring-secondaryColor transition"
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
                className="bg-[#0D3343] rounded overflow-hidden shadow hover:bg-[#1b4d5f] transition cursor-pointer"
              >
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg">{item.name}</h3>
                  <p className="text-secondaryColor mt-1">
                    {(item.discount_price || item.price).toLocaleString()} VND
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400">
              Không tìm thấy món nào phù hợp.
            </p>
          )}
        </div>

        {/* Pagination */}
        {total > 6 && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={!hasPrevPage}
              className="px-4 py-2 rounded bg-gray-600 text-white disabled:opacity-50"
            >
              ← Trang trước
            </button>
            <span className="text-white">Trang {page}</span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={!hasNextPage}
              className="px-4 py-2 rounded bg-gray-600 text-white disabled:opacity-50"
            >
              Trang sau →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;