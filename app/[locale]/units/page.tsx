import { Metadata } from 'next';
import UnitsContent from './UnitsContent';

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
  return <UnitsContent />;
}
