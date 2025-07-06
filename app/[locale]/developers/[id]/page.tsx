'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaMapMarkerAlt, FaBuilding, FaArrowLeft } from 'react-icons/fa';
import { Link } from '@/i18n/navigation';
import ImageBG from '../../components/ImageBG';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Metadata } from 'next';

type Developer = {
  _id: string;
  name: string;
  logo: string;
  description?: string;
  projects?: Project[];
};

type Project = {
  _id: string;
  name: string;
  image: string[];
  zone: string;
  developer: string;
  isUnique?: boolean;
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const devRes = await fetch(`http://localhost:3000/api/Developers/${id}`);
    const developer = await devRes.json();
    
    return {
      title: `${developer.name} - Real Estate Developer | APEX Real Estate`,
      description: `Discover ${developer.name} projects and properties in Alexandria, Egypt. ${developer.description || 'Leading real estate developer with premium properties and projects.'} Contact APEX Real Estate for more information.`,
      keywords: `${developer.name}, real estate developer Egypt, property developer Alexandria, ${developer.name} projects, APEX real estate`,
      openGraph: {
        title: `${developer.name} - Real Estate Developer | APEX Real Estate`,
        description: `Discover ${developer.name} projects and properties in Alexandria, Egypt. ${developer.description || 'Leading real estate developer with premium properties.'}`,
        url: `https://apex-realestate.com/developers/${id}`,
        siteName: 'APEX Real Estate',
        images: [
          {
            url: developer.logo || '/images/og-default.jpg',
            width: 1200,
            height: 630,
            alt: `${developer.name} - Real Estate Developer`,
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${developer.name} - Real Estate Developer | APEX Real Estate`,
        description: `Discover ${developer.name} projects and properties in Alexandria, Egypt.`,
        images: [developer.logo || '/images/og-default.jpg'],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch (error) {
    return {
      title: 'Real Estate Developer - APEX Real Estate',
      description: 'Discover leading real estate developers and their projects in Alexandria, Egypt. Contact APEX Real Estate for more information.',
      openGraph: {
        title: 'Real Estate Developer - APEX Real Estate',
        description: 'Discover leading real estate developers and their projects in Alexandria, Egypt.',
        url: 'https://apex-realestate.com/developers',
        siteName: 'APEX Real Estate',
        images: [
          {
            url: '/images/og-default.jpg',
            width: 1200,
            height: 630,
            alt: 'Real Estate Developer - APEX Real Estate',
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Real Estate Developer - APEX Real Estate',
        description: 'Discover leading real estate developers and their projects in Alexandria, Egypt.',
        images: ['/images/og-default.jpg'],
      },
    };
  }
}

const Page = () => {
  const t = useTranslations('common');
  const { id } = useParams();
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch developer details with populated projects
        const devRes = await fetch(`/api/Developers/${id}`);
        const devData = await devRes.json();
        setDeveloper(devData);

        // Use the projects that are already populated with the developer
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
              <p className="mt-2 text-white">جارٍ التحميل...</p>
            </div>
          ) : developer ? (
            <>
              {/* Developer Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-black/70 backdrop-blur-md rounded-2xl border border-white/20 p-6 sm:p-8 mb-8"
              >
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white/30 shadow-lg overflow-hidden relative">
                      <Image
                        src={developer.logo || '/images/no-image.png'}
                        alt={developer.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-[#b70501] text-white text-xs px-3 py-1 rounded-full font-bold">
                      {t('developer')}
                    </div>
                  </div>
                  
                  <div className="text-center sm:text-right flex-1">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                      {developer.name}
                    </h2>
                    {developer.description && (
                      <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-2xl">
                        {developer.description}
                      </p>
                    )}
                    <div className="mt-4">
                      <a
                        href={`https://wa.me/201111993383?text=أنا مهتم بالتواصل مع مطور ${developer.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-all duration-300"
                      >
                        <FaWhatsapp />
                        <span>{t('whatsapp')}</span>
                      </a>
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
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                    {t('projects')} {developer.name}
                  </h3>
                  <span className="text-white/70 text-sm sm:text-base">
                    {projects.length} {t('projectsCount')}
                  </span>
                </div>

                {projects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {projects.map((project) => (
                      <motion.div
                        key={project._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="group relative h-80 rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                      >
                        <Image
                          src={project.image?.[0] || '/images/no-image.png'}
                          alt={project.name}
                          fill
                          className="object-cover z-0 group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                        
                        {/* Title at top */}
                        <div className="relative z-20 p-6 pb-0">
                          <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[#b70501] transition-colors duration-300">
                            {project.name}
                          </h4>
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
                                <div className="flex items-center gap-2">
                                  <FaBuilding className="text-white" />
                                  <span>{developer.name}</span>
                                </div>
                              </div>
                              <a
                                href={`https://wa.me/201111993383?text=أنا مهتم بمشروع ${project.name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-500 p-3 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110"
                                aria-label="WhatsApp"
                                onClick={e => e.stopPropagation()}
                              >
                                <FaWhatsapp size={20} />
                              </a>
                            </div>
                          </div>
                        </div>

                        {project.isUnique && (
                          <div className="absolute top-4 right-4 bg-[#b70501] text-white text-xs px-3 py-1 rounded-full font-bold z-20">
                            مميز
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏗️</div>
                    <p className="text-xl font-medium text-white">{t('noDeveloperProjects')}</p>
                    <p className="text-sm text-white/70 mt-2">سيتم إضافة المشاريع قريباً</p>
                  </div>
                )}
              </motion.div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">❌</div>
              <p className="text-xl font-medium text-white">لم يتم العثور على المطور</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
