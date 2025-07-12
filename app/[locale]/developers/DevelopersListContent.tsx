'use client';

import { Link } from '@/i18n/navigation';
import { useAppContext } from '@/app/[locale]/context/contextData';
import ImageBG from '../components/ImageBG';
import { FaWhatsapp } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useCurrentLocale, getLocalizedObject } from '../utils/localeUtils';

interface Developer {
  _id: string;
  name: string;
  name_en?: string;
  logo?: string;
  description?: string;
  description_en?: string;
}

export default function DevelopersListContent() {
  const t = useTranslations('common');
  const { Developers, loading } = useAppContext();
  const locale = useCurrentLocale();

  // Get localized developers
  const localizedDevelopers = (Developers as Developer[]).map(developer => ({
    ...developer,
    name: getLocalizedObject(developer, 'name', locale),
    description: getLocalizedObject(developer, 'description', locale) ||
      (locale === 'ar' ? 'مطور عقاري معتمد' : 'Certified Real Estate Developer')
  }));

  return (
    <>
      <ImageBG />

      <div className="relative z-10 px-6 py-24 bg-black/80 min-h-[calc(100vh-200px)] w-screen">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-white mb-16 drop-shadow-lg">
          {t('developers')}
        </h1>

        {loading ? (
          <div className="text-center text-white">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-2">{t('loadingDevelopers')}</p>
          </div>
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
              {localizedDevelopers.map((dev: Developer) => (
                <div
                  key={dev._id}
                  className="group flex flex-col items-center bg-black/60 backdrop-blur-md rounded-2xl shadow-xl p-6 transition-all duration-300 hover:scale-105 border border-white/20"
                >
                  <Link href={`/developers/${dev._id}`} className="flex flex-col items-center w-full">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full border-4 border-white/30 shadow-lg group-hover:border-[#b70501] transition-colors duration-300 overflow-hidden relative bg-white">
                        <Image
                          src={dev.logo || '/images/no-image.png'}
                          alt={dev.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-[#b70501] text-white text-xs px-2 py-1 rounded-full font-bold">
                        {t('developer')}
                      </div>
                    </div>

                    <h3 className="mt-4 text-center font-bold text-white text-lg group-hover:text-[#b70501] transition-colors duration-300">
                      {dev.name}
                    </h3>
                    {/* 
                    <p className="mt-2 text-center text-white/70 text-sm">
                      {dev.description}
                    </p> */}
                  </Link>

                  {/* زر واتساب - أسفل معلومات المطور */}
                  <div className="mt-4">
                    <Link
                      href={`https://wa.me/201111993383?text=${locale === 'ar' ? 'أنا مهتم بمطور' : 'I am interested in developer'} ${dev.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="WhatsApp"
                      className="w-12 aspect-square flex items-center justify-center
               bg-[#25D366] hover:bg-white text-white hover:text-[#25D366]
               rounded-full shadow-lg transition-all duration-300
               hover:scale-110 hover:shadow-xl border-2 border-[#25D366]/30
               hover:border-[#25D366] cursor-pointer hover:rotate-12"
                    >
                      <FaWhatsapp size={20} />
                    </Link>
                  </div>

                </div>
              ))}
            </div>

            {localizedDevelopers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏢</div>
                <p className="text-xl font-medium text-white">{t('noDevelopers')}</p>
                <p className="text-sm text-white/70 mt-2">
                  {locale === 'ar' ? 'سيتم إضافة المطورين قريباً' : 'Developers will be added soon'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
} 