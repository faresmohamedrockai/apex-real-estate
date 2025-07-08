'use client';

import { useTranslations } from 'next-intl';
import ApexIntro from '../[locale]/components/WhoWe';
import HomeVideo from './components/HomeVideo';
import DeveloperMarquee from './components/marquee';
import { useAppContext } from './context/contextData';
import { FaWhatsapp, FaMapMarkerAlt, FaBuilding, FaBed, FaBath } from 'react-icons/fa';
import ImageBG from './components/ImageBG';
import ReviewsSlider from './sections/review';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCurrentLocale, getLocalizedObject } from './utils/localeUtils';

interface Project {
  _id: string;
  name: string;
  image?: string[];
  zone?: string;
  developer?: string;
  isUnique?: boolean;
}

interface Unit {
  _id: string;
  title: string;
  images?: string[];
  bedrooms: number;
  bathrooms: number;
  price: number;
  isUnique?: boolean;
}

export default function HomePageContent() {
  const t = useTranslations('common');
  const { projects, inventory, loading } = useAppContext();
  const locale = useCurrentLocale();
  const featuredUnits = (inventory || []).filter((unit: unknown) => {
    const unitItem = unit as Unit;
    return unitItem.isUnique;
  });

  useEffect(() => {
    const cards = document.querySelectorAll('.card-3d-interactive');
    
    cards.forEach((card) => {
      const handleMouseMove = (e: Event) => {
        const mouseEvent = e as MouseEvent;
        const rect = card.getBoundingClientRect();
        const x = mouseEvent.clientX - rect.left;
        const y = mouseEvent.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        (card as HTMLElement).style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
      };
      
      const handleMouseLeave = () => {
        (card as HTMLElement).style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      };
      
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    });
  }, [projects, featuredUnits]);

  return (
    <div className="font-cairo bg-black/60">
      {/* HomeVideo Component في البداية */}
      <HomeVideo />

      {/* من نحن */}
      <section className="relative py-16 sm:py-20 md:py-28 px-2 sm:px-4 md:px-8 font-[Playpen_Sans_Arabic]">
        <ApexIntro />
      </section>

      {/* الأقسام الثلاثة بخلفية واحدة ثابتة */}
      <ImageBG />
      <section className="relative w-full min-h-[180vh] overflow-hidden">
        <div className="relative z-20">
          {/* شركاء النجاح */}
          <div className="relative z-20 px-2 sm:px-4 md:px-8 py-10 sm:py-16 w-full">
            <div className="m-auto mb-10 sm:mb-16 w-fit p-4 sm:p-8 md:p-10 rounded-b-4xl">
              <h1 className="font-bold text-white text-2xl sm:text-3xl md:text-5xl text-center rounded-2xl">
                {t('successPartners')}
              </h1>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center justify-center">
              <DeveloperMarquee />
            </div>
          </div>
          
          {/* شبكة كروت المشاريع */}
          <div className="py-12 px-2 sm:px-4 md:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('allProjects')}</h2>
              
            </div>
            {loading ? (
              <div className="text-center text-white">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="mt-2">{t('loadingProjects')}</p>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects && projects.length > 0 ? projects.slice(0, 6).map((project: unknown) => {
                    const projectItem = project as Project;
                    const localizedProject = {
                      ...projectItem,
                      name: getLocalizedObject(projectItem, 'name', locale),
                      zone: getLocalizedObject(projectItem, 'zone', locale) || (locale === 'ar' ? 'غير محدد' : 'Not specified'),
                      developer: getLocalizedObject(projectItem, 'developer', locale)
                    };
                    return (
                    <Link
                      key={localizedProject._id}
                      href={`/projects/${localizedProject._id}`}
                      className="card-3d-interactive relative h-80 rounded-2xl overflow-hidden shadow-xl block cursor-pointer"
                      dir={locale === 'ar' ? 'rtl' : 'ltr'}
                    >
                      <Image
                        src={localizedProject.image?.[0] || '/images/no-image.png'}
                        alt={localizedProject.name}
                        fill
                        className="object-cover z-0 group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                      <div className="card-glare"></div>
                      
                      {/* Title at top */}
                      <div className={`relative z-20 p-6 pb-0 flex flex-end w-full ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
                        <h2 className="text-xl font-bold w-fit text-end text-white bg-black/45 rounded-4xl p-3 mb-2 group-hover:text-[#b70501] transition-colors duration-300">
                          {localizedProject.name}
                        </h2>
                       
                      </div>

                      {/* Info section at bottom with black overlay */}
                      <div className="absolute bottom-0 left-0 right-0 z-20">
                        <div className="bg-black/70 backdrop-blur-sm p-4">
                          <div className="flex items-center justify-between">
                            <div className="text-white text-sm space-y-1">
                              <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-white" />
                                <span>{localizedProject.zone}</span>
                              </div>
                              {localizedProject.developer && (
                                <div className="flex items-center gap-2">
                                  <FaBuilding className="text-white" />
                                  <span>{localizedProject.developer}</span>
                                </div>
                              )}
                            </div>
                            <div
                              className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl border-2 border-green-400/30 cursor-pointer hover:rotate-12"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open(`https://wa.me/201111993383?text=${locale === 'ar' ? 'أنا مهتم بمشروع' : 'I am interested in project'} ${localizedProject.name}`, '_blank');
                              }}
                            >
                              <FaWhatsapp size={18} className="text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                  }) : (
                    <div className="col-span-full text-center py-12">
                      <div className="text-6xl mb-4">🏗️</div>
                      <p className="text-xl font-medium text-white">{t('noProjects')}</p>
                      <p className="text-sm text-white/70 mt-2">سيتم إضافة المشاريع قريباً</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* الوحدات المميزة */}
          <div className="py-12 px-2 sm:px-4 md:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('featuredUnits')}</h2>
            </div>
            {loading ? (
              <div className="text-center text-white">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="mt-2">{t('loadingUnits')}</p>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredUnits && featuredUnits.length > 0 ? featuredUnits.map((unit: unknown) => {
                    const unitItem = unit as Unit;
                    const localizedUnit = {
                      ...unitItem,
                      title: getLocalizedObject(unitItem, 'title', locale)
                    };
                    return (
                      <Link
                        key={localizedUnit._id}
                        href={`/units/${localizedUnit._id}`}
                        className="card-3d-interactive relative h-80 rounded-2xl overflow-hidden shadow-xl block cursor-pointer"
                        dir={locale === 'ar' ? 'rtl' : 'ltr'}
                      >
                        <Image
                          src={localizedUnit.images?.[0] || '/images/no-image.png'}
                          alt={localizedUnit.title}
                          fill
                          className="object-cover z-0 group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                        <div className="card-glare"></div>
                        
                        {/* Title at top */}
                        <div className={`relative z-20 p-6 pb-0 ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
                          <h2 className="text-xl font-bold w-fit text-white bg-black/55 rounded-4xl p-3 mb-2 group-hover:text-[#b70501] transition-colors duration-300">
                            {localizedUnit.title}
                          </h2>
                        </div>

                        {/* Info section at bottom with black overlay */}
                        <div className="absolute bottom-0 left-0 right-0 z-20">
                          <div className="bg-black/70 backdrop-blur-sm p-4">
                            <div className="flex items-center justify-between">
                              <div className="text-white text-sm space-y-1">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1">
                                    <FaBed className="text-white" />
                                    <span>{localizedUnit.bedrooms}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <FaBath className="text-white" />
                                    <span>{localizedUnit.bathrooms}</span>
                                  </div>
                                </div>
                                <div className="font-bold text-lg">
                                  {localizedUnit.price.toLocaleString()} {t('egp')}
                                </div>
                              </div>
                              <div
                                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl border-2 border-green-400/30 cursor-pointer hover:rotate-12"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  window.open(`https://wa.me/201111993383?text=${locale === 'ar' ? 'أنا مهتم بوحدة' : 'I am interested in unit'} ${localizedUnit.title}`, '_blank');
                                }}
                              >
                                <FaWhatsapp size={18} className="text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  }) : (
                    <div className="col-span-full text-center py-12">
                      <div className="text-6xl mb-4">🏠</div>
                      <p className="text-xl font-medium text-white">{t('noUnits')}</p>
                      <p className="text-sm text-white/70 mt-2">سيتم إضافة الوحدات قريباً</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* التقييمات */}
      <section className="relative py-16 px-2 sm:px-4 md:px-8">
        <ReviewsSlider />
      </section>
    </div>
  );
} 