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

export default function HomePage() {
  const t = useTranslations('common');
  const { projects, inventory, loading } = useAppContext();
  const featuredUnits = (inventory || []).filter((unit: any) => unit.isUnique);

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
      <section className="relative py-10 sm:py-14 md:py-20 px-2 sm:px-4 md:px-8 font-[Playpen_Sans_Arabic]">
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
                  {projects && projects.length > 0 ? projects.map((project: any) => (
                    <Link
                      key={project._id}
                      href={`/projects/${project._id}`}
                      className="card-3d-interactive relative h-80 rounded-2xl overflow-hidden shadow-xl block cursor-pointer"
                    >
                      <img
                        src={project.image?.[0] || '/images/no-image.png'}
                        alt={project.name}
                        className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                      <div className="card-glare"></div>
                      
                      {/* Title at top */}
                      <div className="relative z-20 p-6 pb-0">
                        <h2 className="text-xl font-bold text-white mb-2 group-hover:text-[#b70501] transition-colors duration-300">
                          {project.name}
                        </h2>
                       
                      </div>

                      {/* Info section at bottom with black overlay */}
                      <div className="absolute bottom-0 left-0 right-0 z-20">
                        <div className="bg-black/70 backdrop-blur-sm p-4">
                          <div className="flex items-center justify-between">
                            <div className="text-white text-sm space-y-1">
                              <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-white" />
                                <span>{project.zone || 'غير محدد'}</span>
                              </div>
                              {project.developer && (
                                <div className="flex items-center gap-2">
                                  <FaBuilding className="text-white" />
                                  <span>{project.developer}</span>
                                </div>
                              )}
                            </div>
                            <div
                              className="bg-green-500 p-3 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110"
                              onClick={(e) => {
                                e.preventDefault();
                                window.open(`https://wa.me/201111993383?text=أنا مهتم بمشروع ${project.name}`, '_blank');
                              }}
                            >
                              <FaWhatsapp size={20} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {project.isUnique && (
                        <div className="absolute top-4 right-4 bg-[#b70501] text-white text-xs px-3 py-1 rounded-full font-bold z-20">
                          مميز
                        </div>
                      )}
                    </Link>
                  )) : (
                    <div className="text-center py-12 col-span-full">
                      <div className="text-6xl mb-4">🏗️</div>
                      <p className="text-xl font-medium text-white">{t('noProjects')}</p>
                    </div>
                  )}
                </div>
                
                {/* زر عرض جميع المشاريع في النص */}
                <div className="text-center mt-12">
                  <Link
                    href="/projects"
                    className="inline-block bg-[#b70501] hover:bg-[#a00401] text-white px-8 py-3 rounded-xl transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {t('viewAllProjects')}
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* شبكة كروت الشقق المميزة */}
          <div className="py-12 px-2 sm:px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">{t('featuredUnits')}</h2>
            {loading ? (
              <div className="text-center text-white">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="mt-2">{t('loadingUnits')}</p>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredUnits && featuredUnits.length > 0 ? featuredUnits.map((unit: any) => (
                    <Link
                      key={unit._id}
                      href={`/units/${unit._id}`}
                      className="card-3d-interactive relative h-80 rounded-2xl overflow-hidden shadow-xl block cursor-pointer"
                    >
                      <img
                        src={unit.images?.[0] || '/images/no-image.png'}
                        alt={unit.title}
                        className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                      <div className="card-glare"></div>
                      
                      {/* Title at top */}
                      <div className="relative z-20 p-6 pb-0">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#b70501] transition-colors duration-300">
                          {unit.title}
                        </h3>
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
                                <span>{t('price')}:</span>
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
                              <FaWhatsapp size={20} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {unit.isUnique && (
                        <div className="absolute top-4 right-4 bg-[#b70501] text-white text-xs px-3 py-1 rounded-full font-bold z-20">
                          {t('unique')}
                        </div>
                      )}
                    </Link>
                  )) : (
                    <div className="text-center py-12 col-span-full">
                      <div className="text-5xl mb-4">🏠</div>
                      <p className="text-lg font-medium text-white">{t('noUnits')}</p>
                    </div>
                  )}
                </div>
                
                {/* زر عرض جميع الشقق في النص */}
                <div className="text-center mt-12">
                  <Link
                    href="/units"
                    className="inline-block bg-[#b70501] hover:bg-[#a00401] text-white px-8 py-3 rounded-xl transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {t('viewAllUnits')}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* مراجعات العملاء */}
      <ReviewsSlider />
    </div>
  );
}
