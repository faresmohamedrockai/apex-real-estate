import React from 'react';
import { useTranslations } from 'next-intl';
import ImageUnderWord from '../sections/Hero';
import ImageBG from '../components/ImageBG';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'About APEX Real Estate - Leading Property Marketing Company in Alexandria',
    description: 'Learn about APEX Real Estate, the leading property marketing company in Alexandria, Egypt. Discover our vision, services, and commitment to excellence in real estate marketing and property consultation.',
    keywords: 'about APEX real estate, property marketing company Alexandria, real estate services Egypt, APEX company profile, real estate marketing experts Egypt',
    openGraph: {
      title: 'About APEX Real Estate - Leading Property Marketing Company in Alexandria',
      description: 'Learn about APEX Real Estate, the leading property marketing company in Alexandria, Egypt. Discover our vision, services, and commitment to excellence.',
      url: 'https://apex-realestate.com/about_us',
      siteName: 'APEX Real Estate',
      images: [
        {
          url: '/images/og-default.jpg',
          width: 1200,
          height: 630,
          alt: 'About APEX Real Estate - Property Marketing Company',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'About APEX Real Estate - Leading Property Marketing Company in Alexandria',
      description: 'Learn about APEX Real Estate, the leading property marketing company in Alexandria, Egypt.',
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

const Page = () => {
  const t = useTranslations('About_Us');

  return (
    <>
      <ImageBG />

      
      <div className="relative z-10">
        <ImageUnderWord text={t('about')} />

        
        <div className="max-w-7xl mx-auto px-6 py-24 bg-black/80">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
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
                    <li> {t('address')}</li>
                    <li> {t('phone')}</li>
                    <li> {t('email')}</li>
                    <li>
                       Facebook:{' '}
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
                className="bg-black/60 backdrop-blur-md rounded-xl p-6 text-lg font-semibold text-white shadow-lg border border-white/20"
              >
                <h2 className="text-3xl font-extrabold text-white mb-4">{item.title}</h2>
                <div>{item.content}</div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
