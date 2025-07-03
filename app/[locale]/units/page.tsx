'use client';

import React from 'react';
import { useAppContext } from '../context/contextData';
import { Link } from '@/i18n/navigation';

const InventoryPage = () => {
  const { inventory, loading } = useAppContext();

  return (
    <div className="relative text-white overflow-hidden min-h-screen">
      {/* الخلفية */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/499559019_122164762280571767_7813678523530159916_n.jpg"
          alt="background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#b70501]/40" />
      </div>

      {/* المحتوى */}
      <div className="relative z-10 px-6 py-24">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-white mb-16 drop-shadow-lg">
          الوحدات المتاحة
        </h1>

        {loading ? (
          <p className="text-center text-white">جارٍ تحميل الوحدات...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {inventory.map((item) => (
              <div
                key={item._id}
                className="relative bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition-transform flex flex-col border border-white/20"
              >
                {/* ✅ كل محتوى الكارد */}
                <Link
                  href={`/units/${item._id}`}
                  className="flex flex-col cursor-pointer"
                >
                  {/* صورة الوحدة */}
                  <div className="relative">
                    <img
                      src={item.images?.[0] || '/images/no-image.png'}
                      alt={item.title}
                      className="w-full h-52 object-cover"
                    />

                    <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full shadow">
                      {item.unitType}
                    </div>

                    {item.isUnique && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow">
                        مميزة
                      </div>
                    )}
                  </div>

                  {/* تفاصيل الوحدة */}
                  <div className="p-4 text-right space-y-1">
                    <h2 className="text-lg font-bold text-white">{item.title}</h2>
                    <p className="text-sm text-white/80">💰 {item.price.toLocaleString()} ج.م</p>
                    <p className="text-sm text-white/80">📐 {item.area} م²</p>
                    <p className="text-sm text-white/80">🛏 {item.bedrooms} | 🛁 {item.bathrooms}</p>
                    {item.projectId && (
                      <>
                        <p className="text-sm text-white/70">🏢 {item.projectId.name}</p>
                        <p className="text-sm text-white/70">📍 {item.projectId.zone}</p>
                      </>
                    )}
                  </div>
                </Link>

           
                <div className="p-4 pt-0 text-left">
                  <a
                    href={`https://wa.me/201234567890?text=مرحبًا، مهتم بالوحدة: ${item.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 p-3 rounded-full shadow-lg hover:bg-green-600 transition inline-block"
                    aria-label="WhatsApp"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="white"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.52 3.48A11.913 11.913 0 0 0 12.005 0C5.38 0 .012 5.365.012 11.994c0 2.104.547 4.162 1.587 5.97L0 24l6.23-1.584a11.96 11.96 0 0 0 5.775 1.468c6.626 0 11.993-5.365 11.993-11.994a11.923 11.923 0 0 0-3.478-8.41zM12.005 22.09a9.993 9.993 0 0 1-5.12-1.407l-.367-.218-3.692.938.985-3.591-.24-.369a9.986 9.986 0 0 1-1.554-5.45c0-5.52 4.488-10.005 10.005-10.005a9.91 9.91 0 0 1 7.087 2.93 9.91 9.91 0 0 1 2.93 7.087c0 5.517-4.484 10.005-10.004 10.005zm5.602-7.517c-.308-.154-1.824-.897-2.106-1-.28-.103-.483-.154-.685.154-.2.308-.786.999-.963 1.202-.176.205-.353.231-.662.077-.308-.154-1.3-.478-2.475-1.523-.915-.814-1.533-1.824-1.712-2.132-.18-.308-.02-.474.134-.628.138-.137.308-.356.462-.534.154-.18.205-.308.308-.514.1-.205.05-.385-.025-.538-.077-.154-.682-1.643-.936-2.245-.246-.59-.496-.51-.682-.52-.176-.008-.385-.01-.59-.01-.205 0-.538.077-.82.385-.28.308-1.08 1.054-1.08 2.57 0 1.514 1.106 2.976 1.26 3.181.154.205 2.18 3.333 5.284 4.675.739.319 1.316.51 1.765.653.74.235 1.414.202 1.948.123.595-.088 1.824-.745 2.082-1.465.257-.72.257-1.338.18-1.465-.077-.128-.282-.206-.59-.36z" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
