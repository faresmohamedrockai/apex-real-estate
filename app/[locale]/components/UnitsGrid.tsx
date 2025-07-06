import React from 'react';
import { FaWhatsapp, FaMapMarkerAlt, FaBed, FaBath } from 'react-icons/fa';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface Unit {
  _id: string;
  title: string;
  images?: string[];
  bedrooms: number;
  bathrooms: number;
  region?: string;
  price: number;
  isUnique?: boolean;
}

interface Unit {
  _id: string;
  title: string;
  images?: string[];
  bedrooms: number;
  bathrooms: number;
  region?: string;
  price: number;
  isUnique?: boolean;
}

interface UnitsGridProps {
  units: Unit[];
  loading?: boolean;
  title?: string;
}

const UnitsGrid: React.FC<UnitsGridProps> = ({ units, loading, title = 'الشقق المميزة' }) => {
  const t = useTranslations('common');
  return (
  <div className="py-12 px-2 sm:px-4 md:px-8">
    <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">{title}</h2>
    {loading ? (
      <div className="text-center text-white">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <p className="mt-2">{t('loadingUnits')}</p>
      </div>
    ) : (
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {units.length > 0 ? (
<<<<<<< HEAD
            units.map((unit: unknown) => {
              const unitItem = unit as Unit;
              return (
=======
            units.map((unit: Unit) => (
>>>>>>> master
              <Link
                key={unitItem._id}
                href={`/units/${unitItem._id}`}
                className="group relative h-80 rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <Image
                  src={unitItem.images?.[0] || '/images/no-image.png'}
                  alt={unitItem.title}
                  fill
                  className="object-cover z-0 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                
                {/* Title at top */}
                <div className="relative z-20 p-6 pb-0">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#b70501] transition-colors duration-300">
                    {unitItem.title}
                  </h3>
                </div>

                {/* Info section at bottom with black overlay */}
                <div className="absolute bottom-0 left-0 right-0 z-20">
                  <div className="bg-black/70 backdrop-blur-sm p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-white text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <FaBed className="text-white" />
                          <span>{unitItem.bedrooms}</span>
                          <FaBath className="text-white ml-2" />
                          <span>{unitItem.bathrooms}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-white" />
                          <span>{unitItem.region || 'غير محدد'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{t('price')}:</span>
                          <span>{unitItem.price?.toLocaleString()} ج.م</span>
                        </div>
                      </div>
                      <a
                        href={`https://wa.me/201111993383?text=أنا مهتم بالوحدة: ${unitItem.title}`}
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

                {unitItem.isUnique && (
                                  <div className="absolute top-4 right-4 bg-[#b70501] text-white text-xs px-3 py-1 rounded-full font-bold z-20">
                  {t('unique')}
                </div>
                )}
              </Link>
            );
            })
          ) : (
            <div className="text-center py-12 col-span-full">
              <div className="text-5xl mb-4">🏠</div>
              <p className="text-lg font-medium text-white">{t('noUnits')}</p>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
  );
};

export default UnitsGrid; 