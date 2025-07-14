import { Metadata } from 'next';
import ProjectDetailsPage from '@/app/[locale]/components/Projects/ProjectDetailsPage';
import { headers } from 'next/headers';

const getProject = async (id: string) => {
  try {
    const headersList = await headers();
    const host = headersList.get('host');

    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const res = await fetch(`${baseUrl}/api/projects/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();

    


    if (!json.success) {
      throw new Error(json.error || 'لم يتم العثور على المشروع');
    }

    return json.data;
  } catch (error) {
    console.error('Error fetching project:', error);

    return {
      _id: id,
      name: 'مشروع غير متوفر',
      name_en: 'Project Not Available',
      zone: 'غير محدد',
      zone_en: 'Not Specified',
      developer: 'غير محدد',
      developer_en: 'Not Specified',
      image: ['/images/no-image.png'],
      isUnique: false,
      units: [],
      developerId: {
        _id: 'default',
        name: 'مطور افتراضي',
        name_en: 'Default Developer'
      }
    };
  }
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const data = await getProject(id);

    return {
      title: `${data.name} - Real Estate Project | APEX Real Estate`,
      description: `${data.name} project in ${data.zone || 'Alexandria'}, Egypt. ${data.developer ? `Developed by ${data.developer}.` : ''} Discover premium properties and investment opportunities with APEX Real Estate.`,
      keywords: `${data.name}, real estate project Alexandria, ${data.zone} properties, ${data.developer} projects, APEX real estate, property investment Egypt`,
      openGraph: {
        title: `${data.name} - Real Estate Project | APEX Real Estate`,
        description: `${data.name} project in ${data.zone || 'Alexandria'}, Egypt. ${data.developer ? `Developed by ${data.developer}.` : ''} Discover premium properties and investment opportunities.`,
        url: `https://apex-realestate.com/projects/${id}`,
        siteName: 'APEX Real Estate',
        images: [
          {
            url: data.image?.[0] || '/images/og-default.jpg',
            width: 1200,
            height: 630,
            alt: `${data.name} - Real Estate Project`,
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${data.name} - Real Estate Project | APEX Real Estate`,
        description: `${data.name} project in ${data.zone || 'Alexandria'}, Egypt. ${data.developer ? `Developed by ${data.developer}.` : ''}`,
        images: [data.image?.[0] || '/images/og-default.jpg'],
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
      title: 'Real Estate Project - APEX Real Estate',
      description: 'Discover premium real estate projects and investment opportunities in Alexandria, Egypt. Contact APEX Real Estate for more information.',
      openGraph: {
        title: 'Real Estate Project - APEX Real Estate',
        description: 'Discover premium real estate projects and investment opportunities in Alexandria, Egypt.',
        url: 'https://apex-realestate.com/projects',
        siteName: 'APEX Real Estate',
        images: [
          {
            url: '/images/og-default.jpg',
            width: 1200,
            height: 630,
            alt: 'Real Estate Project - APEX Real Estate',
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Real Estate Project - APEX Real Estate',
        description: 'Discover premium real estate projects and investment opportunities in Alexandria, Egypt.',
        images: ['/images/og-default.jpg'],
      },
    };
  }
}


export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const data = await getProject(id);
  
  console.log(data);
  return <ProjectDetailsPage data={data} />;
} 