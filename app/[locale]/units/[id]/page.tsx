import { Metadata } from 'next';
import InventoryDetailsPage from '@/app/[locale]/components/Inventories/InventoryDetailsPage';

const getInventory = async (id: string) => {
  const res = await fetch(`http://localhost:3000/api/inventories/${id}`);
  const json = await res.json();

  if (!json.success) throw new Error('لم يتم العثور على الوحدة');
  return json.data;
};

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const data = await getInventory(params.id);
    
    return {
      title: `${data.title} - Property Details | APEX Real Estate`,
      description: `${data.title} for ${data.unitType} in Alexandria. ${data.bedrooms} bedrooms, ${data.bathrooms} bathrooms. Price: ${data.price?.toLocaleString()} EGP. View details and contact APEX Real Estate.`,
      keywords: `${data.title}, ${data.unitType} Alexandria, ${data.bedrooms} bedroom apartment, real estate Egypt, APEX properties`,
      openGraph: {
        title: `${data.title} - Property Details | APEX Real Estate`,
        description: `${data.title} for ${data.unitType} in Alexandria. ${data.bedrooms} bedrooms, ${data.bathrooms} bathrooms. Price: ${data.price?.toLocaleString()} EGP.`,
        url: `https://apex-realestate.com/units/${params.id}`,
        siteName: 'APEX Real Estate',
        images: [
          {
            url: data.images?.[0] || '/images/og-default.jpg',
            width: 1200,
            height: 630,
            alt: `${data.title} - APEX Real Estate`,
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${data.title} - Property Details | APEX Real Estate`,
        description: `${data.title} for ${data.unitType} in Alexandria. ${data.bedrooms} bedrooms, ${data.bathrooms} bathrooms.`,
        images: [data.images?.[0] || '/images/og-default.jpg'],
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
  } catch (error) {
    return {
      title: 'Property Details - APEX Real Estate',
      description: 'View detailed property information and contact APEX Real Estate for more details.',
      openGraph: {
        title: 'Property Details - APEX Real Estate',
        description: 'View detailed property information and contact APEX Real Estate for more details.',
        url: `https://apex-realestate.com/units/${params.id}`,
        siteName: 'APEX Real Estate',
        images: [
          {
            url: '/images/og-default.jpg',
            width: 1200,
            height: 630,
            alt: 'Property Details - APEX Real Estate',
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Property Details - APEX Real Estate',
        description: 'View detailed property information and contact APEX Real Estate for more details.',
        images: ['/images/og-default.jpg'],
      },
    };
  }
}

export default async function Page({ params }: PageProps) {
  const id = params.id;
  const data = await getInventory(id);

  return <InventoryDetailsPage data={data} />;
}
