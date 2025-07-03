'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

type InventoryType = {
  _id: string;
  title: string;
  price: number;
  unitType: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  isUnique: boolean;
  projectId: {
    name: string;
    zone: string;
  };
};

const InventoryDetailsPage = ({ data }: { data: InventoryType }) => {
  return (
    <div className="relative text-white min-h-screen">
      {/* الخلفية + طبقة شفافة حمراء */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/499559019_122164762280571767_7813678523530159916_n.jpg"
          alt="background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#b70501]/40" />
      </div>

      {/* ✅ المحتوى يبدأ بعد الهيدر */}
      <div className="pt-32">
        {/* سلايدر الصور */}
       <div className="max-w-6xl mx-auto px-4">
  <Swiper
    modules={[Navigation, Pagination]}
    navigation
    pagination={{ clickable: true }}
    className="w-full rounded-xl"
  >
    {(data?.images?.length ?? 0) > 0 ? (
      data.images.map((img, i) => (
        <SwiperSlide key={i}>
          <img
            src={img}
            alt={`slide-${i}`}
            className="w-full h-[500px] md:h-[600px] object-cover rounded-xl"
          />
        </SwiperSlide>
      ))
    ) : (
      <SwiperSlide>
        <img
          src="/images/no-image.png"
          alt="no-image"
          className="w-full h-[500px] object-cover rounded-xl"
        />
      </SwiperSlide>
    )}
  </Swiper>
</div>


        {/* التفاصيل */}
        <div className="max-w-6xl mx-auto px-6 py-16 space-y-6 text-right">
          <div className="flex justify-between items-center">
            <span className="text-lg bg-black/40 px-4 py-1 rounded-full">{data.unitType}</span>
            {data.isUnique && (
              <span className="text-lg bg-red-600 px-4 py-1 rounded-full text-white font-bold">
                مميزة
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold">{data.title}</h1>

          <p className="text-2xl bg-white/20 inline-block px-6 py-2 rounded-full font-semibold">
            💰 السعر: {data.price.toLocaleString()} ج.م
          </p>

          <p className="text-xl">📐 المساحة: {data.area} م²</p>
          <p className="text-xl">🛏️ الغرف: {data.bedrooms} | 🛁 الحمامات: {data.bathrooms}</p>
          <p className="text-xl">🏢 المشروع: {data.projectId?.name}</p>
          <p className="text-xl">📍 المنطقة: {data.projectId?.zone}</p>

          {/* زر واتساب على الشمال */}
          <div className="flex justify-start mt-6">
            <a
              href={`https://wa.me/201234567890?text=مرحبًا، مهتم بالوحدة: ${data.title}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition text-lg flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="white"
                viewBox="0 0 24 24"
              >
                <path d="M20.52 3.48A11.913 11.913 0 0 0 12.005 0C5.38 0 .012 5.365.012 11.994c0 2.104.547 4.162 1.587 5.97L0 24l6.23-1.584a11.96 11.96 0 0 0 5.775 1.468c6.626 0 11.993-5.365 11.993-11.994a11.923 11.923 0 0 0-3.478-8.41zM12.005 22.09a9.993 9.993 0 0 1-5.12-1.407l-.367-.218-3.692.938.985-3.591-.24-.369a9.986 9.986 0 0 1-1.554-5.45c0-5.52 4.488-10.005 10.005-10.005a9.91 9.91 0 0 1 7.087 2.93 9.91 9.91 0 0 1 2.93 7.087c0 5.517-4.484 10.005-10.004 10.005zm5.602-7.517c-.308-.154-1.824-.897-2.106-1-.28-.103-.483-.154-.685.154-.2.308-.786.999-.963 1.202-.176.205-.353.231-.662.077-.308-.154-1.3-.478-2.475-1.523-.915-.814-1.533-1.824-1.712-2.132-.18-.308-.02-.474.134-.628.138-.137.308-.356.462-.534.154-.18.205-.308.308-.514.1-.205.05-.385-.025-.538-.077-.154-.682-1.643-.936-2.245-.246-.59-.496-.51-.682-.52-.176-.008-.385-.01-.59-.01-.205 0-.538.077-.82.385-.28.308-1.08 1.054-1.08 2.57 0 1.514 1.106 2.976 1.26 3.181.154.205 2.18 3.333 5.284 4.675.739.319 1.316.51 1.765.653.74.235 1.414.202 1.948.123.595-.088 1.824-.745 2.082-1.465.257-.72.257-1.338.18-1.465-.077-.128-.282-.206-.59-.36z" />
              </svg>
              واتساب
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDetailsPage;
