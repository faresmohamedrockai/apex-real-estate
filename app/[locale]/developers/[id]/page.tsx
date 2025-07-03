'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Developer = {
  _id: string;
  name: string;
  logo: string;
};

const Page = () => {
  const { id } = useParams();
  const [developer, setDeveloper] = useState<Developer | null>(null);

  useEffect(() => {
    const fetchDeveloper = async () => {
      const res = await fetch(`/api/Developers/${id}`);
      const data = await res.json();
      setDeveloper(data);
    };

    if (id) fetchDeveloper();
  }, [id]);

  return (
    <div className="relative text-white overflow-hidden min-h-screen">
      {/* ✅ الخلفية والطبقة الشفافة */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/499559019_122164762280571767_7813678523530159916_n.jpg"
          alt="background"
          className="w-full h-full object-cover bg-zoom"
        />
        <div className="absolute inset-0 bg-[#b70501]/40" />
      </div>

      {/* ✅ المحتوى */}
      <div className="relative z-10 px-6 py-24 flex items-center justify-center min-h-[70vh] rounded-2xl">
        {developer ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-10 text-center max-w-lg w-full">
            <img
              src={developer.logo}
              alt={developer.name}
              className="w-32 h-32 object-cover rounded-full border-4 border-white mx-auto shadow-md mb-6"
            />
            <h1 className="text-4xl font-extrabold text-white mb-4 drop-shadow">{developer.name}</h1>
            {/* يمكن إضافة تفاصيل إضافية هنا لاحقاً */}
          </div>
        ) : (
          <p className="text-lg text-white/80">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Page;
