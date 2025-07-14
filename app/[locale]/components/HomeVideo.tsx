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
      {/* الخلفية المتغيرة */}
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

      {/* طبقة شفافة */}
      <div className="absolute inset-0 w-full h-[100vh] bg-black/60 z-10" />

<div className="relative z-20 h-[90vh] flex items-center justify-center px-4 pt-6">
  <div
    className="max-w-[1400px] w-full flex flex-col md:flex-row items-center justify-between text-white md:text-right rtl:text-right gap-20 px-4"
  >
    {/* النص */}
<div className="flex-1 flex flex-col items-center rtl:md:items-start ltr:md:items-start justify-center text-center rtl:md:text-right ltr:md:text-left space-y-8 pt-12 md:pt-20 px-4 sm:px-6">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-snug drop-shadow-2xl">
          {t('title')}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl lg:text-[1.6rem] font-medium text-gray-200 drop-shadow">
          {t('description')}
        </p>
      </div>

      {/* الزر */}
      <Link href="/contact_us">
        <button className="group cursor-pointer relative inline-block text-base md:text-lg px-8 py-3 border-2 border-white text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:text-white hover:border-0 shadow-2xl hover:scale-105 hover:shadow-2xl mt-4">
          <span className="absolute inset-0 w-full h-full bg-[#b70501] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out z-0" />
          <span className="relative z-10">{t('cta')}</span>
        </button>
      </Link>
    </div>

    {/* الصورة */}
    <div className="flex-1 flex justify-center md:justify-end pt-10 md:pt-20">
      <Image
        src="/logo.png"
        alt="Site Logo"
        width={1000}
        height={1000}
        className="w-[80%] max-w-md h-auto object-contain"
      />
    </div>
  </div>
</div>




    </div>
  );
};

export default HomeVideo;
