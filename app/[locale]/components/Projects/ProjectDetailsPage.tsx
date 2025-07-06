'use client';

import React from 'react';
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
  FaHome,
} from 'react-icons/fa';
import ImageBG from '../ImageBG';
import Link from 'next/link';
import Image from 'next/image';

type ProjectType = {
  _id: string;
  name: string;
  zone: string;
  developer: string;
  image: string[];
  isUnique: boolean;
  units: Array<{
    _id: string;
    title: string;
    price: number;
    unitType: string;
    images: string[];
    bedrooms: number;
    bathrooms: number;
    area: number;
    isUnique: boolean;
  }>;
};

const ProjectDetailsPage = ({ data }: { data: ProjectType }) => {
  const t = useTranslations('common');
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
              href="/projects"
              className="inline-flex items-center gap-2 text-white hover:text-[#b70501] transition-colors mb-4"
            >
              <FaArrowLeft />
              <span>{t('backToProjects')}</span>
            </Link>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 sm:mb-4">
              {t('projectDetails')}
            </h1>
          </motion.div>
        </div>

        {/* سلايدر الصور بعرض الشاشة مع padding بسيط */}
        <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] max-w-none z-20 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Main Image Slider */}
            <div className="bg-black/70 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="w-full"
              >
                {(data?.image?.length ?? 0) > 0 ? (
                  data.image.map((img, i) => (
                    <SwiperSlide key={i}>
                      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px]">
                        <Image
                          src={img}
                          width={1000}
                          height={1000}
                          alt={`slide-${i}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide>
                    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px]">
                      <Image
                        src="/images/no-image.png"
                        width={1000}
                        height={1000}
                        alt="no-image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
            </div>

            {/* Thumbnail Images */}
            {data?.image && data.image.length > 1 && (
              <div className="grid grid-cols-4 gap-2 max-w-4xl mx-auto">
                {data.image.slice(0, 4).map((img, i) => (
                  <div key={i} className="bg-black/50 backdrop-blur-md rounded-lg overflow-hidden border border-white/20 relative h-20 sm:h-24">
                    <Image
                      src={img}
                      width={1000}
                      height={1000}
                      alt={`thumbnail-${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* تفاصيل المشروع بعرض الشاشة مع padding بسيط */}
        <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] max-w-none z-20 px-4 sm:px-6 py-8">
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
                  {t('project')}
                </span>
                {data.isUnique && (
                  <span className="text-sm sm:text-base bg-[#b70501] text-white px-3 py-1 rounded-full font-bold">
                    مميز
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                {data.name}
              </h2>
            </div>

            {/* Project Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Developer */}
              <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <FaBuilding className="text-[#b70501] text-lg" />
                  <div>
                    <p className="text-white/80 text-sm">{t('developer')}</p>
                    <p className="text-white font-bold">{data.developer}</p>
                  </div>
                </div>
              </div>

              {/* Zone */}
              <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-[#b70501] text-lg" />
                  <div>
                    <p className="text-white/80 text-sm">{t('zone')}</p>
                    <p className="text-white font-bold">{data.zone}</p>
                  </div>
                </div>
              </div>

              {/* Units Count */}
              <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <FaHome className="text-[#b70501] text-lg" />
                  <div>
                    <p className="text-white/80 text-sm">{t('unitsCount')}</p>
                    <p className="text-white font-bold">{data.units?.length || 0} وحدة</p>
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <FaMoneyBillWave className="text-[#b70501] text-lg" />
                  <div>
                    <p className="text-white/80 text-sm">{t('priceRange')}</p>
                    <p className="text-white font-bold">
                      {data.units && data.units.length > 0 ? (
                        <>
                          {Math.min(...data.units.map(u => u.price)).toLocaleString()} - {Math.max(...data.units.map(u => u.price)).toLocaleString()} ج.م
                        </>
                      ) : (
                        'غير متوفر'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                مشروع {data.name} من تطوير {data.developer} في منطقة {data.zone}.
                يحتوي المشروع على {data.units?.length || 0} وحدة سكنية متنوعة في المساحات والأسعار.
                {data.units && data.units.length > 0 && (
                  <> يبدأ السعر من {Math.min(...data.units.map(u => u.price)).toLocaleString()} جنيه مصري.</>
                )}
              </p>
            </div>

            {/* Contact Section */}
            <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p className="text-white text-sm sm:text-base mb-4 text-center">
                {t('contactForDetails')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/201111993383?text=مرحبًا، مهتم بمشروع ${data.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                >
                  <FaWhatsapp size={18} />
                  {t('whatsapp')}
                </a>

                <a
                  href="tel:201111993383"
                  className="bg-[#b70501] hover:bg-[#a00401] text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                >
                  <FaMapMarkerAlt size={18} />
                  {t('callNow')}
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* عرض الوحدات المرتبطة بالمشروع */}
        {data.units && data.units.length > 0 && (
          <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] max-w-none z-20 px-4 sm:px-6 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-6"
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
                {t('viewUnits')}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.units.map((unit) => (
                  <Link
                    key={unit._id}
                    href={`/units/${unit._id}`}
                    className="card-3d-interactive relative h-80 rounded-2xl overflow-hidden shadow-xl block cursor-pointer"
                  >
                    <Image
                      src={unit.images?.[0] || '/images/no-image.png'}
                      width={1000}
                      height={1000}
                      alt={unit.title}
                      fill
                      className="object-cover z-0 group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                    <div className="card-glare"></div>

                    {/* Title at top */}
                    <div className="relative z-20 p-6 pb-0">
                      <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#b70501] transition-colors duration-300">
                        {unit.title}
                      </h4>
                    </div>

                    {/* Info section at bottom with black overlay */}
                    <div className="absolute bottom-0 left-0 right-0 z-20">
                      <div className="bg-black/70 backdrop-blur-sm p-4">
                        <div className="flex items-center justify-between">
                          <div className="text-white text-sm space-y-1">
                            <div className="flex items-center gap-2">
                              <FaBed className="text-white" />
                              <span>{unit.bedrooms}</span>
                              <FaBath className="text-white ml-2" />
                              <span>{unit.bathrooms}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaRulerCombined className="text-white" />
                              <span>{unit.area} م²</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>السعر:</span>
                              <span>{unit.price?.toLocaleString()} ج.م</span>
                            </div>
                          </div>
                          <div
                            className="bg-green-500 p-3 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110"
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(`https://wa.me/201111993383?text=أنا مهتم بالوحدة: ${unit.title}`, '_blank');
                            }}
                          >
                            <FaWhatsapp size={16} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {unit.isUnique && (
                      <div className="absolute top-4 right-4 bg-[#b70501] text-white text-xs px-3 py-1 rounded-full font-bold z-20">
                        مميز
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectDetailsPage; 