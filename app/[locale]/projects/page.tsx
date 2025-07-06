import { Metadata } from 'next';
import ProjectsListContent from './ProjectsListContent';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Real Estate Projects in Alexandria - APEX Real Estate',
    description: 'Explore premium real estate projects in Alexandria, Egypt. APEX showcases the best residential and commercial projects from top developers. Find your perfect property investment.',
    keywords: 'real estate projects Alexandria, property projects Egypt, residential projects Alexandria, commercial projects Egypt, APEX real estate projects',
    openGraph: {
      title: 'Real Estate Projects in Alexandria - APEX Real Estate',
      description: 'Explore premium real estate projects in Alexandria, Egypt. APEX showcases the best residential and commercial projects from top developers.',
      url: 'https://apex-realestate.com/projects',
      siteName: 'APEX Real Estate',
      images: [
        {
          url: '/images/og-default.jpg',
          width: 1200,
          height: 630,
          alt: 'Real Estate Projects in Alexandria - APEX Real Estate',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Real Estate Projects in Alexandria - APEX Real Estate',
      description: 'Explore premium real estate projects in Alexandria, Egypt. APEX showcases the best residential and commercial projects.',
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

export default function ProjectsPage() {
  return <ProjectsListContent />;
}
