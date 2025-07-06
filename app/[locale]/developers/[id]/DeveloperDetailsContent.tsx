'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaMapMarkerAlt, FaBuilding, FaArrowLeft } from 'react-icons/fa';
import { Link } from '@/i18n/navigation';
import ImageBG from '../../components/ImageBG';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

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

export default function DeveloperDetailsContent() {
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
                      <p className="text-white/80 text-lg leading-relaxed">
                        {developer.description}
                      </p>
                    )}
                    
                    {/* Contact Button */}
                    <div className="mt-6">
                      <Link
                        href={`https://wa.me/201111993383?text=أنا مهتم بمطور ${developer.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all duration-300 hover:scale-105"
                      >
                        <FaWhatsapp size={20} />
                        <span>{t('contactDeveloper')}</span>
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
                  {t('developerProjects')} ({projects.length})
                </h3>
                
                {projects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
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
                              <span>{project.zone || t('locationNotSpecified')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaBuilding className="text-[#b70501]" />
                              <span>{project.developer}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-black/40 rounded-xl">
                    <div className="text-6xl mb-4">🏗️</div>
                    <p className="text-xl font-medium text-white mb-2">{t('noProjects')}</p>
                    <p className="text-sm text-white/70">{t('projectsComingSoon')}</p>
                  </div>
                )}
              </motion.div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">❌</div>
              <p className="text-xl font-medium text-white mb-2">{t('developerNotFound')}</p>
              <p className="text-sm text-white/70 mb-4">{t('developerNotFoundDesc')}</p>
              <Link
                href="/developers"
                className="inline-flex items-center gap-2 bg-[#b70501] text-white px-6 py-3 rounded-lg hover:bg-[#8a0401] transition-colors"
              >
                <FaArrowLeft />
                <span>{t('backToDevelopers')}</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 