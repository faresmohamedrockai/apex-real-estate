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
    <div className="w-screen py-8 overflow-hidden bg-transparent">
      {loading ? (
        <p className="text-center text-white">جارٍ التحميل...</p>
      ) : (
        <Marquee
          speed={40}
          gradient={false}
          pauseOnHover={false}
          loop={0} // 0 = infinite loop
          className="overflow-hidden"
        >
          {developers.map((dev) => (
            <div
              key={dev._id}
              className="flex-shrink-0 w-[160px] md:w-[200px] flex items-center justify-center mx-6 transition-transform hover:scale-110 p-2 md:p-4 cursor-pointer"
            >
              <Image
                src={dev.logo}
                alt={dev.name}
                width={160}
                height={160}
                className="rounded-xl border-2 md:border-4 shadow-md object-contain transition duration-300 hover:brightness-110 opacity-60 hover:opacity-90"
              />
            </div>
          ))}
        </Marquee>
      )}
    </div>
  );
};

export default DeveloperMarquee;
