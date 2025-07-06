import { Metadata } from 'next';
import DevelopersListContent from './DevelopersListContent';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Top Real Estate Developers in Egypt - APEX Real Estate',
    description: 'Discover leading property developers in Alexandria and Egypt. APEX showcases the best real estate developers with premium projects, apartments, and commercial properties.',
    keywords: 'real estate developers Egypt, property developers Alexandria, top developers Egypt, real estate companies APEX, property investment Egypt',
    openGraph: {
      title: 'Top Real Estate Developers in Egypt - APEX Real Estate',
      description: 'Discover leading property developers in Alexandria and Egypt. APEX showcases the best real estate developers with premium projects.',
      url: 'https://apex-realestate.com/developers',
      siteName: 'APEX Real Estate',
      images: [
        {
          url: '/images/og-default.jpg',
          width: 1200,
          height: 630,
          alt: 'Top Real Estate Developers in Egypt - APEX Real Estate',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Top Real Estate Developers in Egypt - APEX Real Estate',
      description: 'Discover leading property developers in Alexandria and Egypt. APEX showcases the best real estate developers.',
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

export default function DevelopersPage() {
  return <DevelopersListContent />;
}
