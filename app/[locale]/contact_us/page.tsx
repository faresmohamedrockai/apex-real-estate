import { Metadata } from 'next';
import ContactForm from './ContactForm';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Contact APEX Real Estate - Get Expert Property Consultation',
    description:
      'Contact APEX Real Estate for expert property consultation in Alexandria, Egypt. Get personalized advice on buying, selling, or renting properties. Call +20 111 199 3383.',
    keywords:
      'contact APEX real estate, property consultation Alexandria, real estate advice Egypt, property consultation services, APEX contact',
    openGraph: {
      title: 'Contact APEX Real Estate - Get Expert Property Consultation',
      description:
        'Contact APEX Real Estate for expert property consultation in Alexandria, Egypt. Get personalized advice on buying, selling, or renting properties.',
      url: 'https://apex-realestate.com/contact_us',
      siteName: 'APEX Real Estate',
      images: [
        {
          url: '/images/og-default.jpg',
          width: 1200,
          height: 630,
          alt: 'Contact APEX Real Estate - Property Consultation',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Contact APEX Real Estate - Get Expert Property Consultation',
      description:
        'Contact APEX Real Estate for expert property consultation in Alexandria, Egypt.',
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

export default function ContactPage() {
  return <ContactForm />;
}
