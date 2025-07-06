import { Metadata } from 'next';
import DeveloperDetailsContent from './DeveloperDetailsContent';
import { headers } from 'next/headers';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    
    const headersList = await headers();
    const host = headersList.get('host');
    
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const devRes = await fetch(`${baseUrl}/api/Developers/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!devRes.ok) {
      throw new Error(`HTTP error! status: ${devRes.status}`);
    }

    const developer = await devRes.json();
    
    return {
      title: `${developer.name} - Real Estate Developer | APEX Real Estate`,
      description: `Discover ${developer.name} projects and properties in Alexandria, Egypt. ${developer.description || 'Leading real estate developer with premium properties and projects.'} Contact APEX Real Estate for more information.`,
      keywords: `${developer.name}, real estate developer Egypt, property developer Alexandria, ${developer.name} projects, APEX real estate`,
      openGraph: {
        title: `${developer.name} - Real Estate Developer | APEX Real Estate`,
        description: `Discover ${developer.name} projects and properties in Alexandria, Egypt. ${developer.description || 'Leading real estate developer with premium properties.'}`,
        url: `https://apex-realestate.com/developers/${id}`,
        siteName: 'APEX Real Estate',
        images: [
          {
            url: developer.logo || '/images/og-default.jpg',
            width: 1200,
            height: 630,
            alt: `${developer.name} - Real Estate Developer`,
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${developer.name} - Real Estate Developer | APEX Real Estate`,
        description: `Discover ${developer.name} projects and properties in Alexandria, Egypt.`,
        images: [developer.logo || '/images/og-default.jpg'],
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
  } catch {
    return {
      title: 'Real Estate Developer - APEX Real Estate',
      description: 'Discover leading real estate developers and their projects in Alexandria, Egypt. Contact APEX Real Estate for more information.',
      openGraph: {
        title: 'Real Estate Developer - APEX Real Estate',
        description: 'Discover leading real estate developers and their projects in Alexandria, Egypt.',
        url: 'https://apex-realestate.com/developers',
        siteName: 'APEX Real Estate',
        images: [
          {
            url: '/images/og-default.jpg',
            width: 1200,
            height: 630,
            alt: 'Real Estate Developer - APEX Real Estate',
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Real Estate Developer - APEX Real Estate',
        description: 'Discover leading real estate developers and their projects in Alexandria, Egypt.',
        images: ['/images/og-default.jpg'],
      },
    };
  }
}

export default function DeveloperPage() {
  return <DeveloperDetailsContent />;
}
