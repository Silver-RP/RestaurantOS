import { useState } from 'react';
import { useFoodsAdmin } from './useFoods';
import { useNavigate } from 'react-router-dom';

type SortField =
  | 'name'
  | 'price'
  | 'discount_price'
  | 'countInStock'
  | 'views'
  | 'category'
  | 'ordered_count'
  | 'average_rating'
  | 'status'
  | null;

type SortDirection = 'asc' | 'desc';

// Foods index page logic
export function useFoodsAdminLogic() {
  const { foods, loading, error, searchParams, setSearchParams } = useFoodsAdmin();
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const foodList = foods?.docs || [];

  const sortMapping: Record<string, { asc: string; desc: string }> = {
    name: { asc: 'nameAZ', desc: 'nameZA' },
    price: { asc: 'priceLow', desc: 'priceHigh' },
    discount_price: { asc: 'discountLow', desc: 'discountHigh' },
    countInStock: { asc: 'stockHigh', desc: 'stockLow' },
    views: { asc: 'leastViews', desc: 'mostViewed' },
    ordered_count: { asc: 'leastOrdered', desc: 'mostOrdered' },
    average_rating: { asc: 'lowestRated', desc: 'highestRated' },
    category: { asc: 'categoryAZ', desc: 'categoryZA' },
    status: { asc: 'statusAZ', desc: 'statusZA' },
  };

  const handleSort = (field: string) => {
    const direction =
      sortField === field ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';

    setSortField(field as SortField);
    setSortDirection(direction);

    const sortValue = sortMapping[field]?.[direction] || 'default';

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('sort', sortValue);
      newParams.set('page', '1');
      return newParams;
    });
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set('keyword', search.trim());
        newParams.set('page', '1');
        return newParams;
      });
    }
  };

  const handleClick = () => {
    if (search.trim()) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set('keyword', search.trim());
        newParams.set('page', '1');
        return newParams;
      });
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? 'asc' : 'desc';
    }
    return null;
  };

  return {
    foods,
    loading,
    error,
    searchParams,
    setSearchParams,
    sortField,
    sortDirection,
    showFilterPanel,
    setShowFilterPanel,
    search,
    setSearch,
    navigate,
    foodList,
    handleSort,
    handleEnter,
    handleClick,
    getSortIcon,
  };
}

// Foods create page logic
