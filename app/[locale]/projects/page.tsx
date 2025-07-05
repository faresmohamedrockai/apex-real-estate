'use client';

import { useAppContext } from '@/app/[locale]/context/contextData';
import ImageBG from '../components/ImageBG';
import { FaWhatsapp, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface Project {
  _id: string;
  name: string;
  image?: string[];
  zone?: string;
  developer?: string;
  isUnique?: boolean;
}

export default function ProjectsPage() {
  const t = useTranslations('common');
  const { projects, loading } = useAppContext();

  return (
    <>
      <ImageBG />
      
      {/* المحتوى */}
      <div className="relative z-10 px-6 py-24 bg-black/80">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-white mb-16 drop-shadow-lg">
          {t('allProjects')}
        </h1>

        {loading ? (
          <div className="text-center text-white">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-2">{t('loadingProjects')}</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project: Project) => (
              <div
                key={project._id}
                  className="group relative h-80 rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition-all duration-300 border border-white/20"
              >
                {/* صورة كخلفية */}
                <Image
                    src={project.image?.[0] || '/images/no-image.png'}
                  alt={project.name}
                    fill
                    className="object-cover z-0 group-hover:scale-110 transition-transform duration-500"
                />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

                {/* محتوى داخلي */}
                  <div className="relative z-20 flex flex-col justify-between h-full p-6">
                    {/* العنوان والمنطقة */}
                  <div className="text-right">
                      <h2 className="text-xl font-bold text-white mb-2 group-hover:text-[#b70501] transition-colors duration-300">
                        {project.name}
                      </h2>
                      
                      <div className="flex items-center justify-start gap-2 text-white/80 text-sm mb-1">
                        <FaMapMarkerAlt className="text-[#b70501]" />
                        <span>{project.zone || 'غير محدد'}</span>
                  </div>

                      {project.developer && (
                        <div className="flex items-center justify-start gap-2 text-white/80 text-sm">
                          <FaBuilding className="text-[#b70501]" />
                          <span>{project.developer}</span>
                        </div>
                      )}
                    </div>

                    {/* زر واتساب */}
                    <div className="flex justify-end">
                  <a
                    href={`https://wa.me/201111993383?text=أنا مهتم بمشروع ${project.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                        className="bg-green-500 p-3 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110"
                    aria-label="WhatsApp"
                  >
                        <FaWhatsapp size={20} />
                      </a>
                    </div>
                  </div>

                  {/* شارة مميز */}
                  {project.isUnique && (
                    <div className="absolute top-4 right-4 bg-[#b70501] text-white text-xs px-3 py-1 rounded-full font-bold z-20">
                      {t('unique')}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {projects.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏗️</div>
                <p className="text-xl font-medium text-white">{t('noProjects')}</p>
                <p className="text-sm text-white/70 mt-2">سيتم إضافة المشاريع قريباً</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
