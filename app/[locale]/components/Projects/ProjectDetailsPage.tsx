'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

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
import { useTranslations } from 'next-intl';
import { useCurrentLocale, getLocalizedObject } from '../../utils/localeUtils';

type ProjectType = {
  _id: string;
  name: string;
  name_en?: string;
  zone: string;
  zone_en?: string;
  developer: string;
  developer_en?: string;
  image: string[];
  isUnique: boolean;
  minPrice?: number | null;
  units: Array<{
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
  }>;
};

import { useRouter } from 'next/navigation';

const ProjectDetailsPage = ({ data }: { data: ProjectType }) => {
  const t = useTranslations('common');
  const router = useRouter();
  const locale = useCurrentLocale();

  // تجهيز بيانات المشروع حسب اللغة مع fallback
  const localizedProject = {
    ...data,
    name: getLocalizedObject(data, 'name', locale),
    zone: getLocalizedObject(data, 'zone', locale),

    developer: getLocalizedObject(data, 'developer', locale),
    units: data.units?.map(unit => ({
      ...unit,
      title: getLocalizedObject(unit, 'title', locale),
      unitType: getLocalizedObject(unit, 'unitType', locale)
    })) || []
  };



  // Safely define images, initialImages, extraImages
  const images = localizedProject.image || [];
  const initialImages = images.slice(0, 3);
  const extraImages = images.slice(3);

  // Responsive state
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // State for selected image index (desktop)
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [showMore, setShowMore] = React.useState(false);
  const isArabic = locale === 'ar';

  return (
    <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <ImageBG />

      <div className="relative z-10 min-h-screen pt-24 bg-black/60 w-screen">
        {/* Header */}
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

        {/* Slider / Gallery */}
        <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] max-w-none z-20 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {isMobile ? (
              <div className="w-full">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  className="w-full"
                >
                  {(images.length > 0) ? (
                    images.map((img, i) => (
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
              // Desktop: Main image + vertical thumbnails (identical to InventoryDetailsPage)
              <div className="flex flex-row items-start justify-around w-full h-[400px] ">
                {/* Main Image */}
                <div className="bg-black/70 backdrop-blur-md rounded-md border gap-2 border-white/20 overflow-hidden w-[50%] md:w-[56%] h-[350px] md:h-[400px] flex-shrink-0 relative">
                  <Image
                    src={images[selectedImage] || '/images/no-image.png'}
                    alt={`main-image-${selectedImage}`}
                    fill
                    className="object-fill transition-all duration-300"
                  />
                </div>

                {/* Thumbnails Column */}
                {images.length > 1 && (() => {
                  return (
                    <div className="flex flex-col w-[40%] max-h-[400px] overflow-y-auto scrollbar-hidden p-4 gap-2">
                      {/* الصور الأساسية */}
                      <div className="flex flex-wrap gap-2">
                        {initialImages.map((img, i) => (
                          <button
                            key={i}
                            className={`bg-black/50 backdrop-blur-md rounded-md cursor-pointer transition-all duration-100 ease-out delay-75 overflow-hidden border border-white/20 relative h-[200px] ${i === 0 ? 'w-full' : 'w-[49%]'
                              } focus:outline-none ${selectedImage === i ? 'ring-2 ring-[#b70501]' : ''}`}
                            onClick={() => setSelectedImage(i)}
                            tabIndex={0}
                            aria-label={`Show image ${i + 1}`}
                          >
                            <Image
                              src={img}
                              alt={`thumbnail-${i}`}
                              fill
                              className="object-cover"
                            />
                          </button>
                        ))}

                        {/* الصور الإضافية - تظهر فقط عند الضغط على "Show more" */}
                        <AnimatePresence>
                          {showMore &&
                            extraImages.map((img, i) => (
                              <motion.button
                                key={i + 3}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className={`bg-black/50 backdrop-blur-md rounded-md cursor-pointer overflow-hidden border border-white/20 relative h-[200px] w-[48%] focus:outline-none ${selectedImage === i + 3 ? 'ring-2 ring-[#b70501]' : ''}`}
                                onClick={() => setSelectedImage(i + 3)}
                                tabIndex={0}
                                aria-label={`Show image ${i + 4}`}
                              >
                                <Image
                                  src={img}
                                  alt={`thumbnail-${i + 3}`}
                                  fill
                                  className="object-cover"
                                />
                              </motion.button>
                            ))}
                        </AnimatePresence>
                      </div>

                      {/* زر التحكم */}
                      {images.length > 3 && (
                        <button
                          onClick={() => setShowMore(!showMore)}
                          className="mt-2 self-center text-white bg-[#b70501] font-extrabold cursor-pointer hover:bg-[#a00400] px-4 py-2 rounded-md text-sm"
                        >
                          {showMore
                            ? isArabic
                              ? 'إخفاء الصور'
                              : 'Show less'
                            : isArabic
                              ? 'شاهد المزيد'
                              : 'Show more'}
                        </button>
                      )}
                    </div>
                  );
                })()}

              </div>
            )}
          </motion.div>
        </div>

        {/* Project Details */}
        <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] max-w-none z-20 px-4 sm:px-6 py-8"
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-black/70 backdrop-blur-md rounded-2xl border border-white/20 p-4 sm:p-6 space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base bg-[#b70501] text-white px-3 py-1 rounded-full font-medium">
                  {t('project')}
                </span>
                {localizedProject.isUnique && (
                  <span className="text-sm sm:text-base bg-[#b70501] text-white px-3 py-1 rounded-full font-bold">
                    {t("unique")}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{localizedProject.name}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailCard
                icon={<FaBuilding />}
                label={t('developer')}
                value={
                  typeof localizedProject.developer === 'object' &&
                    localizedProject.developer !== null &&
                    'name' in localizedProject.developer
                    ? (localizedProject.developer as any).name
                    : (localizedProject.developer ?? '')
                }
              />
              <DetailCard icon={<FaMapMarkerAlt />} label={t('zone')} value={localizedProject.zone ?? ''} />
              <DetailCard icon={<FaHome />} label={t('unitsCount')} value={locale === 'ar' ? `${localizedProject.units?.length || 0} وحدة` : `${localizedProject.units?.length || 0} unit${(localizedProject.units?.length || 0) === 1 ? '' : 's'}`} />
              <DetailCard
                icon={<FaMoneyBillWave />}
                label={t('priceRange')}
                value={
                  data.minPrice != null
                    ? locale === 'ar'
                      ? `هذا المشروع يبدأ الأسعار فيه من ${data.minPrice.toLocaleString()} جنيه`
                      : `This project starts from ${data.minPrice.toLocaleString()} EGP`
                    : t('notAvailable')
                }
              />



            </div>

            <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p className="text-white/90 text-lg sm:text-base leading-relaxed font-bold">
                {locale === 'ar'
                  ? `مشروع ${localizedProject.name} من تطوير ${typeof localizedProject.developer === 'object' && localizedProject.developer !== null && 'name' in localizedProject.developer
                    ? (localizedProject.developer as any).name
                    : localizedProject.developer ?? ''
                  } في منطقة ${localizedProject.zone}. يحتوي المشروع على ${localizedProject.units?.length || 0} وحدة سكنية متنوعة في المساحات والأسعار.${localizedProject.units && localizedProject.units.length > 0 && localizedProject.units.some((u) => u.price) ? ` يبدأ السعر من ${Math.min(...localizedProject.units.filter((u) => u.price).map((u) => u.price)).toLocaleString()} جنيه.` : ' السعر غير متوفر.'}`
                  : `Project ${localizedProject.name} by ${typeof localizedProject.developer === 'object' && localizedProject.developer !== null && 'name' in localizedProject.developer
                    ? (localizedProject.developer as any).name
                    : localizedProject.developer ?? ''
                  } in ${localizedProject.zone} area. The project contains ${localizedProject.units?.length || 0} residential unit${(localizedProject.units?.length || 0) === 1 ? '' : 's'} of various sizes and prices.${localizedProject.units && localizedProject.units.length > 0 && localizedProject.units.some((u) => u.price) ? ` Starting price from ${Math.min(...localizedProject.units.filter((u) => u.price).map((u) => u.price)).toLocaleString()} EGP.` : ' Price not available.'}`
                }
              </p>
            </div>

            {/* Contact */}
            <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p className="text-white text-sm sm:text-base mb-4 text-center">{t('contactForDetails')}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`https://wa.me/201111993383?text=مرحبًا، مهتم بمشروع ${localizedProject.name}`}
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

        {/* Units */}
        {localizedProject.units && localizedProject.units.length > 0 && (
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
                {localizedProject.units.map((unit) => {
                  // ترجم العنوان والنوع مع fallback
                  const unitTitle = getLocalizedObject(unit, 'title', locale);
                  const unitType = getLocalizedObject(unit, 'unitType', locale);
                  return (
                    <Link
                      key={unit._id}
                      href={`/units/${unit._id}`}
                      className="card-3d-interactive relative h-80 rounded-2xl overflow-hidden shadow-xl block cursor-pointer"
                    >
                      <Image
                        src={unit.images?.[0] || '/images/no-image.png'}
                        alt={unitTitle}
                        fill
                        className="object-cover z-0 group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                      <div className="card-glare"></div>

                      <div className="relative z-20 p-6 pb-0">
                        <h4 className="text-lg font-bold text-white bg-black/45 w-fit p-3 rounded-3xl mb-2 group-hover:text-[#b70501] transition-colors duration-300">
                          {unitTitle}
                        </h4>
                      </div>

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
                                <span>{unit.area} {locale === 'ar' ? 'م²' : 'm²'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>{locale === 'ar' ? 'السعر:' : 'Price:'}</span>
                                <span>{unit.price?.toLocaleString()} {locale === 'ar' ? 'جنيه' : 'EGP'}</span>
                              </div>
                            </div>
                            <div
                              className="bg-green-500 p-3 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110"
                              onClick={(e) => {
                                e.preventDefault();
                                window.open(
                                  `https://wa.me/201111993383?text=${locale === 'ar' ? 'أنا مهتم بالوحدة:' : 'I am interested in the unit:'} ${unitTitle}`,
                                  '_blank'
                                );
                              }}
                            >
                              <FaWhatsapp size={16} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {unit.isUnique && (
                        <div className="absolute top-4 right-4 bg-[#b70501] text-white text-xs px-3 py-1 rounded-full font-bold z-20">
                          {locale === 'ar' ? 'مميز' : 'Featured'}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailsPage;

const DetailCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/20">
    <div className="flex items-center gap-3">
      <div className="text-[#b70501] text-lg">{icon}</div>
      <div>
        <p className="text-white/80 text-sm">{label}</p>
        <p className="text-white font-bold">{value}</p>
      </div>
    </div>
  </div>
);
