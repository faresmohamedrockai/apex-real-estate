'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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
  return (
    <MapContainer
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