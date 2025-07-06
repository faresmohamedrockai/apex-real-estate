'use client';

import { useAppContext } from '@/app/[locale]/context/contextData';
import Image from 'next/image';
import Marquee from 'react-fast-marquee';

type Developer = {
  _id: string;
  logo: string;
  name: string;
};

const DeveloperMarquee = () => {
  const { Developers, loading } = useAppContext();
  const developers: Developer[] = Developers as Developer[];

  return (
    <div className="w-screen py-8 overflow-hidden">
      {loading ? (
        <p className="text-center text-white">جارٍ التحميل...</p>
      ) : (
        <Marquee speed={40}>
          {developers.map((dev) => (
            <div
              key={dev._id}
              className="flex items-center justify-center mx-6 transition-transform hover:scale-110 p-6 cursor-pointer"
            >
              <Image
                src={dev.logo}
                alt={dev.name}
                width={190}
                height={190}
                className="rounded-xl border-4 shadow-md object-cover transition duration-300 hover:brightness-110 opacity-50 hover:opacity-80"
              />
            </div>
          ))}
        </Marquee>
      )}
    </div>
  );
};

export default DeveloperMarquee;
