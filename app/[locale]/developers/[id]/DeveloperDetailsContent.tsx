'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaMapMarkerAlt, FaBuilding, FaArrowLeft } from 'react-icons/fa';
import { Link } from '@/i18n/navigation';
import ImageBG from '../../components/ImageBG';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useCurrentLocale, getLocalizedObject } from '../../utils/localeUtils';

type Developer = {
  _id: string;
  name: string;
  name_en?: string;
  logo: string;
  description?: string;
  description_en?: string;
  projects?: Project[];
};

type Project = {
  _id: string;
  name: string;
  name_en?: string;
  image: string[];
  zone: string;
  zone_en?: string;
  developer: string;
  developer_en?: string;
  isUnique?: boolean;
};

export default function DeveloperDetailsContent() {
  const t = useTranslations('common');
  const { id } = useParams();
  const locale = useCurrentLocale();
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const origin = window.location.origin;
        const devRes = await fetch(`${origin}/api/Developers/${id}`);
        const devData = await devRes.json();
        setDeveloper(devData);

        if (devData.projects && Array.isArray(devData.projects)) {
          setProjects(devData.projects);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);


  // Get localized developer data
  const localizedDeveloper = developer ? {
    ...developer,
    name: getLocalizedObject(developer, 'name', locale),
    description: getLocalizedObject(developer, 'description', locale)
  } : null;

  // Get localized projects
  const localizedProjects = projects.map(project => ({
    ...project,
    name: getLocalizedObject(project, 'name', locale),
    zone: getLocalizedObject(project, 'zone', locale) || t('locationNotSpecified'),
    developer: getLocalizedObject(project, 'developer', locale) || localizedDeveloper?.name || (locale === 'ar' ? 'غير محدد' : 'Not specified')
  }));

  return (
    <>
      <ImageBG />

      <div className="relative z-10 min-h-screen pt-20 sm:pt-24 bg-black/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

          {/* Header with Back Button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 sm:mb-8"
          >
            <Link
              href="/developers"
              className="inline-flex items-center gap-2 text-white hover:text-[#b70501] transition-colors mb-4"
            >
              <FaArrowLeft />
              <span>{t('backToDevelopers')}</span>
            </Link>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 sm:mb-4">
              {t('developerDetails')}
            </h1>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <p className="mt-2 text-white">{locale === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}</p>
            </div>
          ) : localizedDeveloper ? (
            <>

              {/* Developer Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-black/70 backdrop-blur-md rounded-2xl border border-white/20 p-6 sm:p-10 mb-10 w-full flex justify-center"
              >
                <div
                  dir={locale === 'ar' ? 'rtl' : 'ltr'}
                  className={`w-full max-w-5xl flex flex-col md:flex-row ${locale === 'ar' ? 'md:flex-row-reverse' : 'md:flex-row'
                    } items-center text-white gap-8`}
                >
                  {/* صورة المطور */}
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white/30 shadow-lg overflow-hidden shrink-0">
                    <Image
                      src={localizedDeveloper.logo || '/images/no-image.png'}
                      alt={localizedDeveloper.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* الاسم والوصف والزر */}
                  <div className={`flex-1 space-y-4 ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      {locale === 'ar' ? 'عن المطور' : 'About the Developer'}
                    </h2>

                    <h3 className="text-xl sm:text-2xl font-bold">{localizedDeveloper.name}</h3>

                    {(locale === 'ar' && developer?.description) && (
                      <p className="text-white/80 text-lg sm:text-xl leading-relaxed">
                        {developer?.description}
                      </p>
                    )}
                    {(locale === 'en' && developer?.description_en) && (
                      <p className="text-white/80 text-lg sm:text-xl leading-relaxed">
                        {developer?.description_en}
                      </p>
                    )}

                    {/* زر واتساب */}
                    <div className="pt-4">
                      <Link
                        href={`https://wa.me/201111993383?text=${locale === 'ar' ? 'أنا مهتم بمطور' : 'I am interested in developer'
                          } ${localizedDeveloper.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white text-base sm:text-lg font-bold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <FaWhatsapp size={20} className="text-white" />
                        {locale === 'ar' ? 'معرفة المزيد عن المطور' : 'Learn more about Developer'}
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>







              {/* Projects Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                  {t('developerProjects')} ({localizedProjects.length})
                </h3>

                {localizedProjects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {localizedProjects.map((project) => {
                      console.log('Rendering project:', project);
                      return (
                        <Link
                          key={project._id}
                          href={`/projects/${project._id}`}
                          className="group bg-black/60 backdrop-blur-md rounded-xl overflow-hidden shadow-lg border border-white/20 hover:border-[#b70501] transition-all duration-300 hover:scale-105"
                        >
                          <div className="relative h-48">
                            <Image
                              src={project.image?.[0] || '/images/no-image.png'}
                              alt={project.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                            {/* Unique Badge */}
                            {project.isUnique && (
                              <div className="absolute top-3 right-3 bg-[#b70501] text-white text-xs px-2 py-1 rounded-full font-bold">
                                {t('unique')}
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#b70501] transition-colors duration-300">
                              {project.name}
                            </h4>

                            <div className="space-y-1 text-sm text-white/70">
                              <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-[#b70501]" />
                                <span>{project.zone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaBuilding className="text-[#b70501]" />
                                <span>{project.developer}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏗️</div>
                    <p className="text-xl font-medium text-white">{t('noProjects')}</p>
                    <p className="text-sm text-white/70 mt-2">
                      {locale === 'ar' ? 'لا توجد مشاريع لهذا المطور حالياً' : 'No projects for this developer yet'}
                    </p>
                  </div>
                )}
              </motion.div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">❌</div>
              <p className="text-xl font-medium text-white">{t('developerNotFound')}</p>
              <p className="text-sm text-white/70 mt-2">{t('developerNotFoundDesc')}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 