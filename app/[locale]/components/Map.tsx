'use client';

import React, { useEffect, useState, useId } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Alexandria coordinates
const ALEXANDRIA_COORDS = [31.2001, 29.9187];

export default function Map() {
  const [isClient, setIsClient] = useState(false);
  const [MapContainer, setMapContainer] = useState<any>(null);
  const [TileLayer, setTileLayer] = useState<any>(null);
  const [Marker, setMarker] = useState<any>(null);
  const [Popup, setPopup] = useState<any>(null);
  const mapId = useId(); // Generate unique ID for this map instance

  useEffect(() => {
    setIsClient(true);
    
    // Dynamic import to avoid SSR issues
    const loadMapComponents = async () => {
      try {
        const ReactLeaflet = await import('react-leaflet');
        setMapContainer(ReactLeaflet.MapContainer);
        setTileLayer(ReactLeaflet.TileLayer);
        setMarker(ReactLeaflet.Marker);
        setPopup(ReactLeaflet.Popup);
      } catch (error) {
        console.error('Failed to load map components:', error);
      }
    };
    
    loadMapComponents();
  }, []);

  // Show loading state while components are loading
  if (!isClient || !MapContainer || !TileLayer || !Marker || !Popup) {
    return (
      <div className="h-full w-full bg-black/80 backdrop-blur-md rounded-lg flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
          <p>جاري تحميل الخريطة...</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      key={mapId}
      center={ALEXANDRIA_COORDS as [number, number]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={ALEXANDRIA_COORDS as [number, number]}>
        <Popup>
          <div className="text-center">
            <h3 className="font-bold text-[#b70501]">APEX Real Estate</h3>
            <p className="text-sm">الإسكندرية، مصر</p>
            <p className="text-sm">+20 111 199 3383</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
} 