import { Metadata } from 'next';
import InventoryDetailsPage from '@/app/[locale]/components/Inventories/InventoryDetailsPage';
import { headers } from 'next/headers';

const getInventory = async (id: string) => {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/inventories/${id}`);
  const json = await res.json();

  if (!json.success) throw new Error('لم يتم العثور على الوحدة');
  return json.data;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const data = await getInventory(id);

    return {
      title: `${data.title} - Property Details | APEX Real Estate`,
      description: `${data.title} for ${data.unitType} in Alexandria. ${data.bedrooms} bedrooms, ${data.bathrooms} bathrooms. Price: ${data.price?.toLocaleString()} EGP. View details and contact APEX Real Estate.`,
      keywords: `${data.title}, ${data.unitType} Alexandria, ${data.bedrooms} bedroom apartment, real estate Egypt, APEX properties`,
      openGraph: {
        title: `${data.title} - Property Details | APEX Real Estate`,
        description: `${data.title} for ${data.unitType} in Alexandria. ${data.bedrooms} bedrooms, ${data.bathrooms} bathrooms. Price: ${data.price?.toLocaleString()} EGP.`,
        url: `https://apex-realestate.com/units/${id}`,
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
  } catch {
    const { id } = await params;
    return {
      title: 'Property Details - APEX Real Estate',
      description: 'View detailed property information and contact APEX Real Estate for more details.',
      openGraph: {
        title: 'Property Details - APEX Real Estate',
        description: 'View detailed property information and contact APEX Real Estate for more details.',
        url: `https://apex-realestate.com/units/${id}`,
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
  const { id } = await params;
  const data = await getInventory(id);

  return <InventoryDetailsPage data={data} />;
}
