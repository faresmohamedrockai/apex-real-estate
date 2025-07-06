import { Metadata } from 'next';
import HomePageContent from './HomePageContent';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'APEX Real Estate - Leading Property Marketing in Alexandria, Egypt',
    description: 'Discover premium properties for sale and rent in Alexandria, Egypt. APEX offers apartments, villas, and commercial properties with expert real estate services. Find your dream home today.',
    keywords: 'real estate Alexandria, buy apartment Egypt, rent villa Alexandria, property developers Egypt, real estate marketing APEX',
    openGraph: {
      title: 'APEX Real Estate - Premium Properties in Alexandria, Egypt',
      description: 'Leading real estate marketing company in Alexandria. Find apartments, villas, and commercial properties for sale and rent. Expert property services in Egypt.',
      url: 'https://apex-realestate.com',
      siteName: 'APEX Real Estate',
      images: [
        {
          url: '/images/og-default.jpg',
          width: 1200,
          height: 630,
          alt: 'APEX Real Estate - Premium Properties in Alexandria',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'APEX Real Estate - Premium Properties in Alexandria, Egypt',
      description: 'Leading real estate marketing company in Alexandria. Find apartments, villas, and commercial properties for sale and rent.',
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

export default function HomePage() {
  return <HomePageContent />;
}
