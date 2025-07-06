'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

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

interface ApiProject {
  _id: string;
  name: string;
}

interface ApiInventoryItem {
  _id: string;
  title: string;
  unitType: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  region?: string;
  project?: string;
  projectId: string;
  price: number;
  images: string[];
  latitude?: number;
  longitude?: number;
  isUnique?: boolean;
}

export default function Properties() {
  const [inventories, setInventories] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invRes = await fetch('/api/inventories');
        const invData = await invRes.json();

        const projRes = await fetch('/api/projects');
        const projData = await projRes.json();

        const projectMap = new Map<string, string>();
        projData.forEach((project: ApiProject) => {
          projectMap.set(project._id, project.name);
        });

        const merged = invData.map((item: ApiInventoryItem) => ({
          ...item,
          projectId: {
            _id: item.projectId,
            name: projectMap.get(item.projectId) || 'غير معروف',
          },
        }));

        setInventories(merged);
      } catch (err) {
        console.error('حدث خطأ أثناء جلب البيانات:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
      {inventories.map((item) => (
        <div
          key={item._id}
          className="relative rounded-2xl overflow-hidden shadow-xl bg-white/10 backdrop-blur-md group hover:scale-105 transition-transform duration-300"
        >
          {/* صورة العقار */}
          <div className="relative w-full h-64">
            <Image
              src={item.images?.[0] || '/default.jpg'}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>

          {/* نوع العقار */}
          <div className="absolute top-3 right-3 bg-[#b70501] text-white px-3 py-1 rounded-full text-sm shadow-md">
            {item.unitType}
          </div>

          {/* العنوان
          <div className="absolute bottom-[60px] left-0 right-0 text-center text-white font-bold text-md bg-black/40 py-1">
            {item.title}
          </div> */}

          {/* السعر والتواصل */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#b70501]/55 text-white px-4 py-3 flex justify-between items-center text-sm backdrop-blur-sm">
           
            <div>
                <div className="font-extrabold text-lg" >{item.title}</div>
              <div className="font-bold text-lg">{item.price.toLocaleString()} جنيه</div>
              <div className="text-xs mt-1">المشروع: {item.projectId.name}</div>
            </div>
            <a
              href={`https://wa.me/201111993383?text=مرحبًا، مهتم بالشقة: ${item.title}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
            >
              <svg
                className="w-10 h-10"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#40c351"
                  d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626
                  c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396
                  l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,
                  8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776
                  C39.795,19.778,38.156,15.814,35.176,12.832z"
                />
                <path
                  fill="#fff"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82
                  c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594
                  c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906
                  c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187
                  c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255
                  c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543
                  c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,
                  1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738
                  -3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285
                  c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831
                  c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831
                  C20.612,19.329,19.69,16.983,19.268,16.045z"
                />
              </svg>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
