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

export default function UnitsContent() {
  const t = useTranslations('common');
  const { inventory } = useAppContext();

  type InventoryItem = {
    _id: string;
    images?: string[];
    title: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    unitType?: string;
    isUnique?: boolean;
    projectId?: {
      name: string;
      zone: string;
    };
  };

  return (
    <>
      <ImageBG />

      {inventory.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {(inventory as InventoryItem[]).map((item) => (
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
                  <Link
                    href={`https://wa.me/201111993383?text=مرحبًا، مهتم بالوحدة: ${item.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition block"
                    aria-label="WhatsApp"
                  >
                    <FaWhatsapp size={20} />
                  </Link>
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
    </>
  );
}
