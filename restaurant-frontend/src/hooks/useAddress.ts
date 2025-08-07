
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAddressesByUserId } from '../api/AddressApi';
import { Address } from 'types/Address.type';
import { RootState } from 'redux/store';
import {
  getProvinces,
  getDistrictsByProvinceCode,
  getWardsByDistrictCode,
} from '@/api/AddressApi';
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
export const useProvinces = () => {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProvinces().then((data) => {
      setProvinces(data || []);
      setLoading(false);
    });
  }, []);

  return { provinces, loading };
};

export const useDistricts = (provinceCode: string) => {
  const [districts, setDistricts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!provinceCode) return;
    setLoading(true);
    getDistrictsByProvinceCode(provinceCode).then((data) => {
      setDistricts(data || []);
      setLoading(false);
    });
  }, [provinceCode]);

  return { districts, loading };
};

export const useWards = (districtCode: string) => {
  const [wards, setWards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!districtCode) return;
    setLoading(true);
    getWardsByDistrictCode(districtCode).then((data) => {
      setWards(data || []);
      setLoading(false);
    });
  }, [districtCode]);

  return { wards, loading };
};

