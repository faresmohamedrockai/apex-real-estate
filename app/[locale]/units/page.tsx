'use client';
import { useAppContext } from '@/app/[locale]/context/contextData';
import { Link } from '@/i18n/navigation';
import ImageBG from '../components/ImageBG';
import { useTranslations } from 'next-intl';
import {
  FaBed,
  FaBath,
  FaMapMarkerAlt,
  FaBuilding,
  FaWhatsapp,
} from 'react-icons/fa';
import Image from 'next/image';
import { Metadata } from 'next';
import UnitsGrid from './components/UnitsGrid';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Properties for Sale & Rent - APEX Real Estate Alexandria',
    description: 'Browse our extensive collection of properties for sale and rent in Alexandria, Egypt. Find apartments, villas, townhouses, and commercial properties with APEX Real Estate.',
    keywords: 'properties for sale Alexandria, apartments for rent Egypt, villas for sale Alexandria, commercial properties Egypt, real estate listings APEX',
    openGraph: {
      title: 'Properties for Sale & Rent - APEX Real Estate Alexandria',
      description: 'Browse our extensive collection of properties for sale and rent in Alexandria, Egypt. Find your perfect home with APEX Real Estate.',
      url: 'https://apex-realestate.com/units',
      siteName: 'APEX Real Estate',
      images: [
        {
          url: '/images/og-default.jpg',
          width: 1200,
          height: 630,
          alt: 'Properties for Sale & Rent - APEX Real Estate',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Properties for Sale & Rent - APEX Real Estate Alexandria',
      description: 'Browse our extensive collection of properties for sale and rent in Alexandria, Egypt.',
      images: ['/images/og-default.jpg'],
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
}

export default function UnitsPage() {
  const t = useTranslations('common');
  const { inventory } = useAppContext();

  return (
    <>
      <ImageBG />

      <div className="relative z-10 px-2 sm:px-4 md:px-6 py-10 md:py-24 bg-black/80">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-center text-white mb-8 md:mb-16 drop-shadow-lg">
          {t('featuredUnits')}
        </h1>

        {/* Bottom Section: Search Results */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 md:mb-6 gap-2 md:gap-0">
            <h2 className="text-lg md:text-2xl font-bold text-white">جميع الوحدات</h2>
            <span className="text-xs md:text-sm text-white">
              {inventory.length} {t('units')}
            </span>
          </div>
          {/* Results */}
          <div className="space-y-4 md:space-y-6">
            {inventory.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {inventory.map((item) => (
                <div
                  key={item._id}
                    className="relative bg-black/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition-transform flex flex-col border border-white/20 min-h-[320px] md:min-h-[360px]"
                >
                  <Link href={`/units/${item._id}`} className="flex flex-col cursor-pointer">
                    <div className="relative w-full h-32 sm:h-40">
                      <Image
                        src={item.images?.[0] || '/images/no-image.png'}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                        <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-black/70 text-white text-xs px-2 md:px-3 py-1 rounded-full shadow">
                          <span className="text-white">{item.unitType}</span>
                        </div>
                        {item.isUnique && (
                          <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-[#b70501] text-white text-xs px-2 md:px-3 py-1 rounded-full font-bold shadow">
                            <span className="text-white">{t('unique')}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                    <div className="p-3 md:p-4 pt-2 flex flex-row justify-between items-start gap-2 md:gap-4">
                      <div className="text-right flex-1 space-y-1 md:space-y-2 text-white text-xl font-extrabold">
                        <h2 className="text-base md:text-lg font-bold text-white">{item.title}</h2>
                        <div className="flex items-center justify-start gap-1 md:gap-2">
                          <span className="text-white">{t('price')} :</span>
                          <span className="text-white">{item.price.toLocaleString()} ج.م</span>
                        </div>
                        <div className="flex items-center justify-start gap-1 md:gap-2">
                          <FaBed className="text-white" />
                          <span className="text-white">{item.bedrooms}</span>
                          <span className="text-white">|</span>
                          <FaBath className="text-white" />
                          <span className="text-white">{item.bathrooms}</span>
                      </div>
                      {item.projectId && (
                        <>
                            <div className="flex items-center justify-start gap-1 md:gap-2">
                              <FaBuilding className="text-white" />
                              <span className="text-white">{item.projectId.name}</span>
                          </div>
                            <div className="flex items-center justify-start gap-1 md:gap-2">
                              <FaMapMarkerAlt className="text-white" />
                              <span className="text-white">{item.projectId.zone}</span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="pt-1">
                      <a
                        href={`https://wa.me/201111993383?text=مرحبًا، مهتم بالوحدة: ${item.title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition block"
                        aria-label="WhatsApp"
                      >
                        <FaWhatsapp size={20} />
                      </a>
                    </div>
                  </div>
                </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                
                <p className="text-lg font-medium text-white">{t('noUnits')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
