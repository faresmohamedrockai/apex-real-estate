'use client';

import { useAppContext } from '@/app/[locale]/context/contextData';
import Image from 'next/image';
import Marquee from 'react-fast-marquee';

const DeveloperMarquee = () => {
  const { Developers, loading } = useAppContext();

  return (
    <div className="w-screen py-8 overflow-hidden">
      {loading ? (
        <p className="text-center text-white">جارٍ التحميل...</p>
      ) : (
        <Marquee
          speed={40}
          direction="left"
          loop={0}               
          gradient={false}       
          pauseOnHover={false}   
          play={true}            
          className="flex items-center"
        >
          {Developers.map((dev) => (
            <div
              key={dev._id}
              className="flex items-center justify-center mx-6 transition-transform hover:scale-110 p-8 cursor-pointer"
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
