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
<div className="w-full flex flex-col items-center justify-center text-center space-y-8 pt-32 sm:pt-40 md:pt-48" style={{ fontFamily: '"El Messiri", sans-serif' }}>
  <div className="md:w-3/4 space-y-6">
    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-snug text-white drop-shadow-2xl">
      {t('title')}
    </h1>
    <p className="text-lg md:text-xl lg:text-2xl font-medium text-gray-200 drop-shadow-lg">
      {t('description')}
    </p>
  </div>

  {/* الزر */}
  <Link href="/contact_us">
    <button className="group cursor-pointer relative inline-block text-lg md:text-xl px-10 py-4 border-2 border-white text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:text-white hover:border-0 shadow-2xl">
      <span className="absolute inset-0 w-full h-full bg-[#b70501] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out z-0" />
      <span className="relative z-10">{t('cta')}</span>
    </button>
  </Link>
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
