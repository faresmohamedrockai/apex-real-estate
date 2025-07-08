'use client';

import { Link } from "@/i18n/navigation";
import ImageBG from './ImageBG';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const ApexIntro = () => {
  const t = useTranslations('About_Us');
  const t2 = useTranslations('HomeVideoAboutUs');
  const t3 = useTranslations('common');
  
  return (
    <>
      <h1 className="text-center font-bold text-2xl md:text-6xl text-white mt-45">{t2("whowh")}</h1>
      <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-white/80 rounded-3xl shadow-2xl p-6 md:p-10 backdrop-blur-sm mt-45">

        {/* النص الترحيبي */}
        <div className="space-y-5 text-gray-800">
        
          <p className="text-sm text-gray-500">{t3("InfoHi")}</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#b70501] leading-snug">
            {t('successStoriesTitle')}
          </h2>
          <p className="text-sm md:text-base leading-relaxed">
            {t('whoWeAreText')}
          </p>
          <Link href={'/about_us'} className="px-5 py-2 bg-[#b70501] text-white rounded-full font-semibold hover:bg-[#930400] transition">
            {t2("buttonWhoWe")}
          </Link>
        </div>

        {/* الصورة مع التصميم الدائري */}
        <div className="flex justify-center">
          <div className="rounded-full overflow-hidden shadow-lg w-52 h-52 relative">
            <Image
              src="/red.logo.jpg"
              alt="Apex Logo"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ApexIntro;
