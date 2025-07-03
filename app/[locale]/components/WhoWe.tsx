'use client';

import { Link } from "@/i18n/navigation";

const ApexIntro = () => {
  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-white/80 rounded-3xl shadow-2xl p-6 md:p-10 backdrop-blur-sm" style={{ fontFamily: '"El Messiri", sans-serif' }}>
      
      {/* النص الترحيبي */}
      <div className="space-y-5 text-gray-800">
        <p className="text-sm text-gray-500">مرحبًا بكم في APEX</p>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#b70501] leading-snug">
          هنا تبدأ قصص النجاح
        </h2>
        <p className="text-sm md:text-base leading-relaxed">
          نحن شركة <strong>APEX</strong> المتخصصة في تسويق وتأجير وبيع الوحدات السكنية، التجارية والإدارية بجميع أنحاء الإسكندرية.
          نقدم خدمات احترافية من <strong>يد المالك مباشرة</strong> إلى العميل، ونسعى دائمًا لتلبية احتياجات السوق بدقة وشفافية.
          نتعامل مع قاعدة واسعة من العملاء <span className="text-[#b70501] font-semibold">الجادين والموثوقين</span>.
        </p>
        <Link href={'/about_us'} className="px-5 py-2 bg-[#b70501] text-white rounded-full font-semibold hover:bg-[#930400] transition">
          اعرف المزيد
        </Link>
      </div>

      {/* الصورة مع التصميم الدائري */}
      <div className="flex justify-center">
        <div className="rounded-full  overflow-hidden shadow-lg w-52 h-52">
          <img
            src="/red.logo.jpg"
            alt="Apex Logo"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ApexIntro;
