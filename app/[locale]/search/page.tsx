import { Metadata } from 'next';
import SearchContent from './SearchContent';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Search Properties in Alexandria - APEX Real Estate',
    description: 'Search and discover properties for sale and rent in Alexandria, Egypt. Use our advanced filters to find apartments, villas, and commercial properties. APEX Real Estate makes property search easy.',
    keywords: 'search properties Alexandria, find apartments Egypt, property search tools, real estate search Alexandria, APEX property search, property filters Egypt',
    openGraph: {
      title: 'Search Properties in Alexandria - APEX Real Estate',
      description: 'Search and discover properties for sale and rent in Alexandria, Egypt. Use our advanced filters to find your perfect property.',
      url: 'https://apex-realestate.com/search',
      siteName: 'APEX Real Estate',
      images: [
        {
          url: '/images/og-default.jpg',
          width: 1200,
          height: 630,
          alt: 'Search Properties in Alexandria - APEX Real Estate',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Search Properties in Alexandria - APEX Real Estate',
      description: 'Search and discover properties for sale and rent in Alexandria, Egypt. Use our advanced filters to find your perfect property.',
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

export default function SearchPage() {
  return <SearchContent />;
}
