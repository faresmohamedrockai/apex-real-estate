'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import ImageUnderWord from '../sections/Hero';

const Page = () => {
  const t = useTranslations('About_Us');

  return (
    <div className="relative text-white overflow-hidden">
      {/* ✅ خلفية ثابتة تغطي كل الصفحة */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/499559019_122164762280571767_7813678523530159916_n.jpg"
          alt="background"
          className="w-full h-full object-cover"
        />
        {/* ✅ طبقة شفافة حمراء فوق الخلفية */}
        <div className="absolute inset-0 bg-[#b70501]/40 backdrop-blur-sm" />
      </div>

      {/* ✅ المحتوى */}
      <div className="relative z-10">
        <ImageUnderWord text={t('about')} />

        {/* ✅ شبكة الأعمدة مع كروت شفافة بلور */}
        <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
          {[
            {
              title: t('whoWeAreTitle'),
              content: <p>{t('whoWeAreText')}</p>
            },
            {
              title: t('whyChooseTitle'),
              content: (
                <ul className="list-disc list-inside space-y-2">
                  <li>{t('point1')}</li>
                  <li>{t('point2')}</li>
                  <li>{t('point3')}</li>
                  <li>{t('point4')}</li>
                </ul>
              )
            },
            {
              title: t('visionTitle'),
              content: <p>{t('visionText')}</p>
            },
            {
              title: t('servicesTitle'),
              content: (
                <ul className="list-decimal list-inside space-y-2">
                  <li>{t('service1')}</li>
                  <li>{t('service2')}</li>
                  <li>{t('service3')}</li>
                </ul>
              )
            },
            {
              title: t('contactTitle'),
              content: (
                <ul className="space-y-2">
                  <li>📍 {t('address')}</li>
                  <li>📞 {t('phone')}</li>
                  <li>📧 {t('email')}</li>
                  <li>
                    🌐 Facebook:{' '}
                    <a
                      href="https://www.facebook.com/people/Apex-Real-Estate-Investment/61567153032479/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-white hover:text-[#ffcccc]"
                    >
                      {t('facebook')}
                    </a>
                  </li>
                </ul>
              )
            }
          ].map((item, index) => (
            <section
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-lg font-semibold text-white shadow-lg"
            >
              <h2 className="text-3xl font-extrabold text-white mb-4">{item.title}</h2>
              <div>{item.content}</div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
