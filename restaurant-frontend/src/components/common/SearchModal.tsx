import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { closeSearchModal, setSearchQuery } from '../../redux/feature/searchModal/searchModalSlice';

interface Props {
  data: {
    id: string | number;
    name: string;
    imageUrl: string;
    price: number;
    discountedPrice?: number;
  }[];
}

const SearchModal: React.FC<Props> = ({ data }) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.searchModal.isOpen);
  const query = useSelector((state: RootState) => state.searchModal.query);

  const filteredItems = data.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm text-white p-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto bg-[#102f43] p-6 rounded-lg shadow-xl relative">
        <button
          onClick={() => dispatch(closeSearchModal())}
          className="absolute top-4 right-4 text-white text-2xl"
        >
          ×
        </button>

        <h2 className="text-2xl mb-4 font-semibold">Tìm kiếm món ăn</h2>

        <input
          type="text"
          placeholder="Nhập tên món ăn..."
          className="w-full p-3 mb-6 text-black rounded outline-none"
          value={query}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#0D3343] rounded overflow-hidden shadow hover:bg-[#1b4d5f] transition cursor-pointer"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-secondaryColor mt-1">
                    {(item.discountedPrice || item.price).toLocaleString()} VND
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
      </div>
    </div>
  );
};

export default SearchModal;