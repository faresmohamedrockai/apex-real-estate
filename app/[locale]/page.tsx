'use client';
import { useTranslations } from 'next-intl';
import ApexIntro from '../[locale]/components/WhoWe';
import HomeVideo from './components/HomeVideo';
import DeveloperMarquee from './components/marquee';

export default function HomePage() {



  const t = useTranslations('HomePage');

  return (
    <div style={{ fontFamily: 'Vazirmatn, cursive' }}>
   
      <HomeVideo />

      {/* من نحن */}
      <section className="relative bg-[url('/images/499559019_122164762280571767_7813678523530159916_n.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
        <div className="relative z-10 py-16 px-4 " style={{ fontFamily: 'Playpen Sans Arabic' }}>
          <ApexIntro />
        </div>
      </section>

      {/* عبارة تشويقية مع صورة وخلفية */}
      <section className="relative w-full min-h-screen overflow-hidden">
        {/* صورة الخلفية مع أنميشن */}
        <div className="absolute inset-0 z-0 bg-cover bg-center bg-[url('/images/494657209_122164219880571767_7999384793239097936_n.jpg')] bg-zoom" />

        {/* طبقة سوداء شفافة */}
        <div className="absolute inset-0 bg-[#b70501]/50 z-10" />








        {/* عرض الكروت */}
    <div className="relative z-20 px-0 py-16 w-screen"> {/* px-0 و w-screen عشان العرض كامل */}
  <div className="m-auto mb-20 w-fit p-10 rounded-b-4xl">
    <h1
      className="font-bold text-white text-5xl text-center rounded-2xl"
      style={{ fontFamily: 'Playpen Sans Arabic' }}
    >
      شركاء النجاح
    </h1>
  </div>
  <DeveloperMarquee />
</div>




        </section>
    </div>
  );
}
