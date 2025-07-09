'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';

import {
  FaMoneyBillWave,
  FaBed,
  FaBath,
  FaMapMarkerAlt,
  FaBuilding,
  FaWhatsapp,
  FaRulerCombined,
  FaArrowLeft,
} from 'react-icons/fa';
import ImageBG from '../ImageBG';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useCurrentLocale, getLocalizedObject } from '../../utils/localeUtils';

type InventoryType = {
  _id: string;
  title: string;
  title_en?: string;
  price: number;
  unitType: string;
  unitType_en?: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  isUnique: boolean;
  projectId: {
    name: string;
    name_en?: string;
    zone: string;
    zone_en?: string;
  };
};

const InventoryDetailsPage = ({ data }: { data: InventoryType }) => {
  const t = useTranslations('common');
  const locale = useCurrentLocale();

  // Get localized data
  const localizedData = {
    ...data,
    title: getLocalizedObject(data, 'title', locale),
    unitType: getLocalizedObject(data, 'unitType', locale),
    projectId: {
      ...data.projectId,
      name: getLocalizedObject(data.projectId, 'name', locale),
      zone: getLocalizedObject(data.projectId, 'zone', locale)
    }
  };

  // Responsive state
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // State for selected image index (desktop)
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <>
      <ImageBG />

      <div className="relative z-10 min-h-screen pt-24 bg-black/60">
        {/* Header with Back Button */}
        <div className="relative z-30 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto mb-6 sm:mb-8"
          >
            <Link
              href="/units"
              className="inline-flex items-center gap-2 text-white hover:text-[#b70501] transition-colors mb-4"
            >
              <FaArrowLeft />
              <span>{t('backToUnits')}</span>
            </Link>






            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 sm:mb-4">
              {t('unitDetails')}
            </h1>
          </motion.div>






        </div>

        {/* Responsive Image Gallery */}
        <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] max-w-none z-20 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {isMobile ? (
              // Mobile: Swiper slider
              <div className="w-full">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  className="w-full"
                >
                  {(localizedData?.images?.length ?? 0) > 0 ? (
                    localizedData.images.map((img, i) => (
                      <SwiperSlide key={i}>
                        <div className="relative w-full h-[250px] sm:h-[300px]">
                          <Image
                            src={img}
                            alt={`slide-${i}`}
                            fill
                            className="object-cover rounded-2xl"
                          />
                        </div>
                      </SwiperSlide>
                    ))
                  ) : (
                    <SwiperSlide>
                      <div className="relative w-full h-[250px] sm:h-[300px]">
                        <Image
                          src="/images/no-image.png"
                          alt="no-image"
                          fill
                          className="object-cover rounded-2xl"
                        />
                      </div>
                    </SwiperSlide>
                  )}
                </Swiper>
              </div>
            ) : (
              // Desktop: Main image + vertical thumbnails
              <div className="flex flex-row items-start justify-around w-full">
                {/* Main Image */}
                <div className="bg-black/70 backdrop-blur-md rounded-md border gap-2 border-white/20 overflow-hidden w-[50%] md:w-[56%] h-[350px] md:h-[400px] flex-shrink-0 relative">
                  <Image
                    src={localizedData.images?.[selectedImage] || '/images/no-image.png'}
                    alt={`main-image-${selectedImage}`}
                    fill
                    className="object-fill transition-all duration-300"
                  />
                </div>


                {/* Thumbnails Column */}
                {localizedData?.images && localizedData.images.length > 1 && (
                  <div className="flex flex-row flex-wrap gap-2 w-[40%] h-[400px] overflow-y-auto">
                    {localizedData.images.map((img, i) => (
                      <button
                        key={i}
                        className={`bg-black/50 backdrop-blur-md  cursour overflow-hidden border border-white/20 relative w-[100%] h-[200px] md:w-[100%]  focus:outline-none ${selectedImage === i ? 'ring-2 ring-[#b70501]' : ''}`}
                        onClick={() => setSelectedImage(i)}
                        tabIndex={0}
                        aria-label={`Show image ${i + 1}`}
                      >
                        <Image
                          src={img}
                          alt={`thumbnail-${i}`}
                          fill
                          className="object-fill"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* التفاصيل بعرض الشاشة مع padding بسيط */}
        <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] max-w-none z-20 px-4 sm:px-6 py-8"
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-black/70 backdrop-blur-md rounded-2xl border border-white/20 p-4 sm:p-6 space-y-6"
          >
            {/* Title and Badges */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base bg-[#b70501] text-white px-3 py-1 rounded-full font-medium">
                  {localizedData.unitType}
                </span>
                {localizedData.isUnique && (
                  <span className="text-sm sm:text-base bg-[#b70501] text-white px-3 py-1 rounded-full font-bold">
                    {locale === 'ar' ? 'مميزة' : 'Featured'}
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                {localizedData.title}
              </h2>
            </div>

            {/* Price */}
            <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <FaMoneyBillWave className="text-[#b70501] text-xl sm:text-2xl" />
                <div>
                  <p className="text-white/80 text-sm">{t('price')}</p>
                  <p className="text-white text-xl sm:text-2xl font-bold">
                    {localizedData.price.toLocaleString()} {locale === 'ar' ? 'ج.م' : 'EGP'}
                  </p>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Area */}
              <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <FaRulerCombined className="text-[#b70501] text-lg" />
                  <div>
                    <p className="text-white/80 text-sm">{t('area')}</p>
                    <p className="text-white font-bold">{localizedData.area} {locale === 'ar' ? 'م²' : 'm²'}</p>
                  </div>
                </div>
              </div>

              {/* Bedrooms & Bathrooms */}
              <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <FaBed className="text-[#b70501] text-lg" />
                    <FaBath className="text-[#b70501] text-lg" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">{t('bedrooms')} {locale === 'ar' ? 'و' : '&'} {t('bathrooms')}</p>
                    <p className="text-white font-bold">
                      {localizedData.bedrooms} {locale === 'ar' ? 'غرف' : 'BR'} | {localizedData.bathrooms} {locale === 'ar' ? 'حمام' : 'BA'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Project */}
              <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <FaBuilding className="text-[#b70501] text-lg" />
                  <div>
                    <p className="text-white/80 text-sm">{t('project')}</p>
                    <p className="text-white font-bold">{localizedData.projectId.name}</p>
                  </div>
                </div>
              </div>

              {/* Zone */}
              <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-[#b70501] text-lg" />
                  <div>
                    <p className="text-white/80 text-sm">{t('zone')}</p>
                    <p className="text-white font-bold">{localizedData.projectId.zone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                {locale === 'ar' 
                  ? `وحدة ${localizedData.unitType} مميزة في مشروع ${localizedData.projectId.name} بمنطقة ${localizedData.projectId.zone}. تتميز بمساحة ${localizedData.area} متر مربع مع ${localizedData.bedrooms} غرف نوم و${localizedData.bathrooms} حمامات. السعر ${localizedData.price.toLocaleString()} جنيه مصري.`
                  : `${localizedData.unitType} unit in ${localizedData.projectId.name} project in ${localizedData.projectId.zone} area. Features ${localizedData.area} square meters with ${localizedData.bedrooms} bedrooms and ${localizedData.bathrooms} bathrooms. Price ${localizedData.price.toLocaleString()} Egyptian Pounds.`
                }
              </p>
            </div>

            {/* Contact Section */}
            <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p className="text-white text-sm sm:text-base mb-4 text-center">
                {t('contactForDetails')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`https://wa.me/201111993383?text=${locale === 'ar' ? 'مرحبًا، مهتم بالوحدة:' : 'Hello, I am interested in the unit:'} ${localizedData.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl border-2 border-green-400/30"
                >
                  <FaWhatsapp size={18} className="text-white" />
                  {t('whatsapp')}
                </Link>

                <Link
                  href="tel:201111993383"
                  className="bg-[#b70501] hover:bg-[#a00401] text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                >
                  <FaMapMarkerAlt size={18} />
                  {t('callNow')}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default InventoryDetailsPage;
