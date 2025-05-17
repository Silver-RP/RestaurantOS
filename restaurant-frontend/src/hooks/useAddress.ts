// src/hooks/useUserAddresses.ts
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAddressesByUserId } from '../api/AddressApi';
import { Address } from 'types/Address.type';
import { RootState } from 'redux/store';

export const useUserAddresses = () => {
  const [data, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.user.user);

  const fetchData = async () => {
    try {
      setLoading(true);
      const addresses = await getAddressesByUserId(); 
      setAddresses(addresses);
      setError(null);
    } catch {
      setError('Lỗi khi tải địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchData();
    }
  }, [user?._id]);

  return { data, loading, error, refetch: fetchData };
};
