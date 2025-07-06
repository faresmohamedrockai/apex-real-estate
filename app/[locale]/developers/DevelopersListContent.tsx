'use client';

import { Link } from '@/i18n/navigation';
import { useAppContext } from '@/app/[locale]/context/contextData';
import ImageBG from '../components/ImageBG';
import { FaWhatsapp } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface Developer {
  _id: string;
  name: string;
  logo?: string;
  description?: string;
}

export default function DevelopersListContent() {
  const t = useTranslations('common');
  const { Developers, loading } = useAppContext();

  return (
    <>
      <ImageBG />

      {/* ✅ المحتوى */}  
      <div className="relative z-10 px-6 py-24 bg-black/80">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-white mb-16 drop-shadow-lg">
          {t('developers')}
        </h1>

        {loading ? (
          <div className="text-center text-white">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-2">{t('loadingDevelopers')}</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {(Developers as Developer[]).map((dev: Developer) => (
                <Link
                  key={dev._id}
                  href={`/developers/${dev._id}`}
                  className="group flex flex-col items-center bg-black/60 backdrop-blur-md rounded-2xl shadow-xl p-6 transition-all duration-300 hover:scale-105 border border-white/20"
                >
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-white/30 shadow-lg group-hover:border-[#b70501] transition-colors duration-300 overflow-hidden relative">
                      <Image
                        src={dev.logo || '/images/no-image.png'}
                        alt={dev.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-[#b70501] text-white text-xs px-2 py-1 rounded-full font-bold">
                      {t('developer')}
                    </div>
                  </div>

                  <h3 className="mt-4 text-center font-bold text-white text-lg group-hover:text-[#b70501] transition-colors duration-300">
                    {dev.name}
                  </h3>

                  <p className="mt-2 text-center text-white/70 text-sm">
                    {dev.description || 'مطور عقاري معتمد'}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`https://wa.me/201111993383?text=أنا مهتم بمطور ${dev.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 p-3 rounded-full hover:bg-green-600 transition-all duration-300 hover:scale-110"
                      aria-label="WhatsApp"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaWhatsapp size={20} />
                    </Link>
                  </div>
                </Link>
              ))}
            </div>

            {Developers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏢</div>
                <p className="text-xl font-medium text-white">{t('noDevelopers')}</p>
                <p className="text-sm text-white/70 mt-2">سيتم إضافة المطورين قريباً</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
} 