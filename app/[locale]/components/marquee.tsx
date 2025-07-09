'use client';

import { useAppContext } from '@/app/[locale]/context/contextData';
import Image from 'next/image';
import { useCurrentLocale } from '../utils/localeUtils';
import { motion } from 'framer-motion';

type Developer = {
  _id: string;
  logo: string;
  name: string;
};

const DeveloperMarquee = () => {
  const { Developers, loading } = useAppContext();
  const developers: Developer[] = Developers as Developer[];
  const locale = useCurrentLocale();

  const reversed = locale === 'ar';
  const originalItems = locale === 'ar' ? [...developers].reverse() : developers;

  // 🔴 الحد الأقصى 12 عنصر فقط
  const slicedItems = originalItems.slice(0, 12);

  // 🟢 نكرر العناصر فقط لو أقل من 6 لتفادي الفراغ
  const finalItems =
    slicedItems.length < 6
      ? [...slicedItems, ...slicedItems]
      : slicedItems;

  return (
    <div className="w-screen py-8 overflow-hidden bg-transparent">
      {loading ? (
        <p className="text-center text-white">جارٍ التحميل...</p>
      ) : (
        <motion.div
          className="flex gap-12"
          initial={{ x: reversed ? '100%' : '-100%' }}
          animate={{ x: reversed ? '-100%' : '100%' }}
          transition={{
            duration: 40, // كلما زاد الرقم كلما كان أبطأ
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {finalItems.map((dev, idx) => (
            <div
              key={dev._id + '-' + idx}
              className="flex-shrink-0 w-32 h-32 md:w-56 md:h-56 flex items-center justify-center mx-6 transition-transform hover:scale-100 p-2 md:p-4 cursor-pointer overflow-hidden rounded-2xl"
            >
              <Image
                src={dev.logo}
                alt={dev.name}
                width={160}
                height={160}
                className="object-fill w-full h-full transition duration-300 hover:brightness-110 opacity-60 hover:opacity-90 rounded-lg"
              />
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default DeveloperMarquee;
