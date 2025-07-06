'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const images = [
  '/images/494657209_122164219880571767_7999384793239097936_n.jpg',
  '/images/496949758_122164219970571767_1853671232034090001_n.jpg',
  '/images/499559019_122164762280571767_7813678523530159916_n.jpg',
  '/images/499794898_122164762250571767_4365539481736873945_n.jpg',
  '/images/499864582_122164762340571767_738447821149212773_n.jpg',
];

const HomeVideo = () => {
  const t = useTranslations('hero');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomIn, setZoomIn] = useState(true);

  useEffect(() => {
    const zoomTimeout = setTimeout(() => {
      setZoomIn(true);
    }, 0);

    const interval = setInterval(() => {
      setZoomIn(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setZoomIn(true);
      }, 50);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(zoomTimeout);
    };
  }, []);

  return (
    <div className="relative z-0">
      
      <div className="absolute inset-0 w-full h-[100vh] overflow-hidden -z-10">
        {images.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={src}
              alt={`Background ${index}`}
              fill
              className={`object-cover transition-transform duration-[6000ms] ease-in-out ${
                index === currentIndex && zoomIn ? 'scale-110' : 'scale-100'
              }`}
            />
          </div>
        ))}
      </div>

      {/* طبقة شفافة سوداء */}
      <div className="absolute inset-0 w-full h-[100vh] bg-[#b70501]/40 z-10"></div>

      {/* المحتوى فوق الخلفية */}
      <div className="relative z-20 h-[100vh] flex items-center justify-center px-4">
        <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-6 text-white text-center md:text-right rtl:text-right" style={{ fontFamily: '"El Messiri", sans-serif' }}>
          
        {/* النص والزر */}
<div className="w-full max-w-6xl space-y-8">
  <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]">
    {t('title')}
  </h1>
  <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
    {t('description')}
  </p>
</div>


         
          <div className="flex justify-center md:justify-start">
            <Image
              src="/logo.jpg"
              alt="Site Logo"
              width={800}
              height={800}
              className=" "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeVideo;
