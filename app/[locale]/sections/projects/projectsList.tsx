'use client';

import ImageBG from '../../components/ImageBG';
import { useAppContext } from '../../context/contextData';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { FaWhatsapp, FaBuilding, FaMapMarkerAlt } from 'react-icons/fa';
import { useCurrentLocale, getLocalizedObject } from '../../utils/localeUtils';

interface Project {
  _id: string;
  name: string;
  name_en?: string;
  description?: string;
  description_en?: string;
  image?: string[];
  zone?: string;
  zone_en?: string;
  developer?: string;
  developer_en?: string;
  status?: string;
  status_en?: string;
  deliveryDate?: string;
  unitsCount?: number;
}

const ProjectsList = () => {
  const t = useTranslations('common');
  const { projects, loading } = useAppContext();
  const locale = useCurrentLocale();

  // Get localized projects
  const localizedProjects = (projects as Project[]).map(project => ({
    ...project,
    name: getLocalizedObject(project, 'name', locale),
    description: getLocalizedObject(project, 'description', locale),
    zone: getLocalizedObject(project, 'zone', locale),
    developer: getLocalizedObject(project, 'developer', locale),
    status: getLocalizedObject(project, 'status', locale)
  }));

  return (
    <>
      <ImageBG />
      <div className="relative z-10 px-6 py-24 bg-black/80">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-white mb-16 drop-shadow-lg">
          {t('projects')}
        </h1>

        {loading ? (
          <div className="text-center text-white">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-2">{t('loadingProjects')}</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {localizedProjects.map((project: Project) => (
                <Link
                  key={project._id}
                  href={`/projects/${project._id}`}
                  className="group flex flex-col bg-black/60 backdrop-blur-md rounded-2xl shadow-xl p-6 transition-all duration-300 hover:scale-105 border border-white/20"
                >
                  <div className="relative mb-4">
                    <div className="w-full h-48 rounded-xl overflow-hidden">
                      <Image
                        src={project.image?.[0] || '/images/no-image.png'}
                        alt={project.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute top-2 right-2 bg-[#b70501] text-white text-xs px-2 py-1 rounded-full font-bold">
                      {t('project')}
                    </div>
                  </div>

                  <h3 className="text-center font-bold text-white text-lg group-hover:text-[#b70501] transition-colors duration-300 mb-2">
                    {project.name}
                  </h3>

                  {project.description && (
                    <p className="text-center text-white/70 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  <div className="space-y-2 text-sm text-white/80">
                    {project.zone && (
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-[#b70501]" />
                        <span>{project.zone}</span>
                      </div>
                    )}
                    
                    {project.developer && (
                      <div className="flex items-center gap-2">
                        <FaBuilding className="text-[#b70501]" />
                        <span>{project.developer}</span>
                      </div>
                    )}

                    {project.status && (
                      <div className="flex items-center gap-2">
                        <span className="text-[#b70501]">{locale === 'ar' ? 'الحالة:' : 'Status:'}</span>
                        <span>{project.status}</span>
                      </div>
                    )}

                    {project.unitsCount && (
                      <div className="flex items-center gap-2">
                        <span className="text-[#b70501]">{locale === 'ar' ? 'الوحدات:' : 'Units:'}</span>
                        <span>{project.unitsCount} {t('units')}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <a
                      href={`https://wa.me/201111993383?text=${locale === 'ar' ? 'أنا مهتم بمشروع' : 'I am interested in project'} ${project.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 p-3 rounded-full hover:bg-green-600 transition-all duration-300 hover:scale-110"
                      aria-label="WhatsApp"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaWhatsapp size={20} />
                    </a>
                  </div>
                </Link>
              ))}
            </div>

            {localizedProjects.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏗️</div>
                <p className="text-xl font-medium text-white">{t('noProjects')}</p>
                <p className="text-sm text-white/70 mt-2">
                  {locale === 'ar' ? 'سيتم إضافة المشاريع قريباً' : 'Projects will be added soon'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectsList;
