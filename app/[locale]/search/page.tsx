'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// لضبط الأيقونة لأن Leaflet ما بيشتغلش بأيقونات default في Next.js
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});


//ايقونة حمرا 

const redIcon = new L.Icon({
  iconUrl: '/icon/apex_icon.png',
  
  iconSize: [50,50],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Page = () => {



  return (
    <div className="relative text-white overflow-hidden min-h-screen">
      {/* ✅ الخلفية + طبقة شفافة */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/499559019_122164762280571767_7813678523530159916_n.jpg"
          alt="background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#b70501]/40" />
      </div>




      {/* ✅ الخريطة */}
      <div className="relative z-10 px-4 py-24 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 drop-shadow">خريطة المشاريع - الإسكندرية</h1>

        <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-lg border border-white/20">
          <MapContainer
            center={[31.2001, 29.9187]} // مركز الخريطة على الإسكندرية
            zoom={12}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* مثال على Marker واحد */}




            <Marker position={[31.2156, 29.9553]} icon={redIcon}>
              <Popup>
                مشروع تجاري – شارع فؤاد
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Page;
