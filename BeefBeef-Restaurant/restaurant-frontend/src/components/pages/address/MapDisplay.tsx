// MapDisplay.tsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapDisplayProps {
  lat: number;
  lon: number;
  street_address: string;
  onLocationSelect?: (lat: number, lon: number) => void;
}

export const MapDisplay: React.FC<MapDisplayProps> = ({
  lat,
  lon,
  street_address,
  onLocationSelect,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([lat, lon], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current);

      // ✅ Cho phép click để chọn vị trí
      mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        if (onLocationSelect) {
          onLocationSelect(lat, lng);
        }
      });
    }

    if (mapRef.current) {
      mapRef.current.setView([lat, lon], 15);

      if (markerRef.current) {
        markerRef.current.remove();
      }

      markerRef.current = L.marker([lat, lon]).addTo(mapRef.current);

    }
  }, [lat, lon, street_address]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        height: '400px',
        width: '100%',
        border: '1px solid #ccc',
        marginTop: '10px',
      }}
    />
  );
};
