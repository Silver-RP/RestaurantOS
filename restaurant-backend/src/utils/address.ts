import axios from 'axios';

export interface NominatimAddress {
  province?: string;
  district?: string;
  ward?: string;
  street?: string;
  lat?: string;
  lon?: string;
}

export async function getAddressFromNominatim(query: string): Promise<NominatimAddress | null> {
  const res = await axios.get('https://nominatim.openstreetmap.org/search', {
    params: {
      q: query,
      format: 'json',
      addressdetails: 1,
      limit: 1,
    },
    headers: {
      'User-Agent': 'beefbeef-app',
    },
  });
  const result = res.data[0];
  if (!result) return null;
  const addr = result.address;
  return {
    province: addr.state || addr.city,
    district: addr.district || addr.town,
    ward: addr.suburb || addr.village,
    street: addr.road,
    lat: result.lat,
    lon: result.lon,
  };
}