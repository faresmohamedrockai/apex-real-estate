import { Metadata } from 'next';
import InventoryDetailsPage from '@/app/[locale]/components/Inventories/InventoryDetailsPage';
import { headers } from 'next/headers';

const getInventory = async (id: string) => {
  try {
    const headersList = await headers();
    const host = headersList.get('host');
    
    // في بيئة الإنتاج، استخدم نفس الخادم
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const res = await fetch(`${baseUrl}/api/inventories/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // إضافة timeout لتجنب الانتظار الطويل
      signal: AbortSignal.timeout(10000), // 10 seconds timeout
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();

    if (!json.success) {
      throw new Error(json.error || 'لم يتم العثور على الوحدة');
    }
    
    return json.data;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    
    // إرجاع بيانات افتراضية في حالة الخطأ
    return {
      _id: id,
      title: 'وحدة غير متوفرة',
      title_en: 'Unit Not Available',
      price: 0,
      unitType: 'سكني',
      unitType_en: 'Residential',
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      images: ['/images/no-image.png'],
      region: 'غير محدد',
      region_en: 'Not Specified',
      project: 'غير محدد',
      project_en: 'Not Specified',
      isUnique: false,
      projectId: {
        _id: 'default',
        name: 'مشروع افتراضي',
        name_en: 'Default Project'
      }
    };
  }
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
