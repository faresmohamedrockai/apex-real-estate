'use client';

import { useEffect, useState, useId } from 'react';
import { useAppContext } from '@/app/[locale]/context/contextData';
import { useCurrentLocale, getLocalizedObject } from '../../utils/localeUtils';
import { Link } from '@/i18n/navigation';

// Dynamic import for React Leaflet components
let MapContainer: React.ComponentType<any> | null = null;
let TileLayer: React.ComponentType<any> | null = null;
let Marker: React.ComponentType<any> | null = null;
let Popup: React.ComponentType<any> | null = null;
let L: unknown = null;

interface Project {
  _id: string;
  name: string;
  region?: string;
  latitude?: number;
  longitude?: number;
}

interface InventoryItem {
  _id: string;
  title: string;
  unitType: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  region?: string;
  project?: string;
  projectId: Project;
  price: number;
  images: string[];
  latitude?: number;
  longitude?: number;
  isUnique?: boolean;
}

interface InventoryMapProps {
  inventory: InventoryItem[];
}

interface MapComponents {
  MapContainer: React.ComponentType<any>;
  TileLayer: React.ComponentType<any>;
  Marker: React.ComponentType<any>;
  Popup: React.ComponentType<any>;
  L: unknown;
}

const InventoryMap: React.FC<InventoryMapProps> = ({ 
  inventory
}) => {
  const { projects } = useAppContext();
  const [isClient, setIsClient] = useState(false);
  const [mapComponents, setMapComponents] = useState<MapComponents | null>(null);
  const mapId = useId(); // Generate unique ID for this map instance
  const locale = useCurrentLocale();

  useEffect(() => {
    setIsClient(true);
    
    // Import React Leaflet components only on client side
    const loadMapComponents = async () => {
      try {
        const ReactLeaflet = await import('react-leaflet');
        const Leaflet = await import('leaflet');
        
        MapContainer = ReactLeaflet.MapContainer;
        TileLayer = ReactLeaflet.TileLayer;
        Marker = ReactLeaflet.Marker;
        Popup = ReactLeaflet.Popup;
        L = Leaflet.default;
        
        // Import CSS
        await import('leaflet/dist/leaflet.css');
        
        // Fix Leaflet icon issues
        if (L && typeof L === 'object' && 'Icon' in L) {
          const LeafletL = L as { Icon: { Default: { prototype: { _getIconUrl?: unknown }; mergeOptions: (options: unknown) => void } } };
          delete LeafletL.Icon.Default.prototype._getIconUrl;
          LeafletL.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
          });
        }
        
        setMapComponents({
          MapContainer,
          TileLayer,
          Marker,
          Popup,
          L
        });
      } catch (error) {
        console.error('Failed to load map components:', error);
      }
    };
    
    loadMapComponents();
  }, []);

  const getPosition = (item: InventoryItem): [number, number] | null => {
    if (item.latitude && item.longitude) {
      return [item.latitude, item.longitude];
    }

    const project = projects.find((p: unknown) => {
      const projectItem = p as Project;
      return projectItem._id === item.projectId._id;
    });
    if (project && typeof project === 'object' && 'latitude' in project && 'longitude' in project) {
      const projectItem = project as Project;
      if (projectItem.latitude && projectItem.longitude) {
        return [projectItem.latitude, projectItem.longitude];
      }
    }

    return null;
  };

  // استخراج جميع الإحداثيات الصحيحة
  const positions = inventory
    .map(getPosition)
    .filter((pos): pos is [number, number] => !!pos);

  // حساب المتوسط
  let center: [number, number] = [29.9553, 31.2554]; // افتراضي: الإسكندرية
  if (positions.length > 0) {
    const avgLat = positions.reduce((sum, pos) => sum + pos[0], 0) / positions.length;
    const avgLng = positions.reduce((sum, pos) => sum + pos[1], 0) / positions.length;
    center = [avgLat, avgLng];
  }

  // Show loading state while components are loading
  if (!isClient || !mapComponents) {
    return (
      <div className="h-full w-full bg-black/80 backdrop-blur-md rounded-lg flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
          <p>{locale==='ar' ? '...جاري تحميل الخريطة':"Map Is Loading..." }</p>
        </div>
      </div>
    );
  }

  // Create red icon for markers
  const redIcon = new (mapComponents.L as { Icon: new (options: unknown) => unknown }).Icon({
    iconUrl: '/icon/apex_icon.png',
    iconSize: [50, 50],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <mapComponents.MapContainer
      key={mapId}
      center={center}
      zoom={8}
      scrollWheelZoom={true}
      className="h-full w-full z-0"
    >
      <mapComponents.TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {inventory.map((item, index) => {
        const position = getPosition(item);
        if (!position) return null;

        return (
          <mapComponents.Marker key={item._id || index} position={position} icon={redIcon}>
            <mapComponents.Popup>
              <div style={{ minWidth: 180, maxWidth: 220, textAlign: locale === 'ar' ? 'right' : 'left' }}>
                <img
                  src={item.images?.[0] || '/images/no-image.png'}
                  alt={item.title}
                  style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }}
                />
                <strong>{getLocalizedObject(item, 'title', locale)}</strong><br />
                {getLocalizedObject(item, 'unitType', locale) && (<>
                  {locale === 'ar' ? 'النوع' : 'Type'}: {getLocalizedObject(item, 'unitType', locale)}<br />
                </>)}
                {typeof item.price === 'number' && !isNaN(item.price) && item.price > 0 ? (
                  <>
                    {locale === 'ar' ? 'السعر' : 'Price'}: {item.price.toLocaleString()} {locale === 'ar' ? 'جنيه' : 'EGP'}
                  </>
                ) : (
                  <>
                    {locale === 'ar' ? 'السعر' : 'Price'}: {locale === 'ar' ? 'غير متوفر' : 'Not available'}
                  </>
                )}
                <div style={{ marginTop: 8, textAlign: 'center' }}>
                  <Link
                    href={`/units/${item._id}`}
                    style={{
                      display: 'inline-block',
                      background: '#b70501',
                      color: 'white',
                      padding: '6px 16px',
                      borderRadius: 8,
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      fontSize: 14,
                      marginTop: 4,
                      transition: 'background 0.2s',
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {locale === 'ar' ? 'تفاصيل الوحدة' : 'Get More'}
                  </Link>
                </div>
              </div>
            </mapComponents.Popup>
          </mapComponents.Marker>
        );
      })}
    </mapComponents.MapContainer>
  );
}

export default InventoryMap;
