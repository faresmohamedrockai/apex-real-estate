'use client';

import { useEffect, useState } from 'react';
import { useAppContext } from '@/app/[locale]/context/contextData';

// Dynamic import for React Leaflet components
let MapContainer: any = null;
let TileLayer: any = null;
let Marker: any = null;
let Popup: any = null;
let L: any = null;

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
  onMarkerClick?: (item: InventoryItem) => void;
  selectedItem?: InventoryItem | null;
}

const InventoryMap: React.FC<InventoryMapProps> = ({ 
  inventory, 
  onMarkerClick, 
  selectedItem 
}) => {
  const { projects } = useAppContext();
  const [isClient, setIsClient] = useState(false);
  const [mapComponents, setMapComponents] = useState<any>(null);

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
        await import('leaflet/dist/leaflet.css' as any);
        
        // Fix Leaflet icon issues
        delete (L.Icon.Default as any).prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
        });
        
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

  const getPosition = (item: any): [number, number] | null => {
    if (item.latitude && item.longitude) {
      return [item.latitude, item.longitude];
    }

    const project = projects.find(p => p._id === item.projectId);
    if (project?.latitude && project?.longitude) {
      return [project.latitude, project.longitude];
    }

    return null;
  };

  const center: [number, number] = [31.2157, 29.9553]; // Alexandria center 

  // Show loading state while components are loading
  if (!isClient || !mapComponents) {
    return (
      <div className="h-full w-full bg-black/80 backdrop-blur-md rounded-lg flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
          <p>جاري تحميل الخريطة...</p>
        </div>
      </div>
    );
  }

  // Create red icon for markers
  const redIcon = new mapComponents.L.Icon({
    iconUrl: '/icon/apex_icon.png',
    iconSize: [50, 50],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const projectMarkers = projects
    .filter((p: any) => p.latitude && p.longitude)
    .map((p: any) => ({
      lat: p.latitude,
      lng: p.longitude,
      title: p.name,
      type: 'project',
      data: p
    }));

  return (
    <mapComponents.MapContainer
      center={center}
      zoom={10}
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
              <strong>{item.title}</strong><br />
              النوع: {item.unitType}<br />
              السعر: {item.price?.toLocaleString()} جنيه
            </mapComponents.Popup>
          </mapComponents.Marker>
        );
      })}
    </mapComponents.MapContainer>
  );
}

export default InventoryMap;
