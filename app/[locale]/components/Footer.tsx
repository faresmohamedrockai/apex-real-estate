'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  const t = useTranslations('Footer');
  const year = new Date().getFullYear();

  return (
    <>
      {/* ✅ فوتر عصري */}
      <footer className="bg-neutral-900 text-white pt-12 pb-6 border-t-4 border-[#b70501]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:justify-between gap-10 md:gap-0">
          {/* تعريف الشركة مع اللوجو */}
          <div className="flex-1 flex flex-col items-center md:items-start mb-8 md:mb-0">
            <Image
              src="/red.logo.jpg"
              alt="Apex Logo"
              width={100}
              height={100}
              className="rounded-full object-cover border-2 shadow-md mb-4"
            />
            <p className="text-white/80 text-center md:text-left text-base font-medium max-w-xs">
              {t('companyDescription')}
            </p>
            <div className="flex gap-3 mt-6">
              <a href="https://www.facebook.com/people/Apex-Real-Estate-Investment/61567153032479/" target="_blank" rel="noopener noreferrer" className="bg-[#b70501] text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:text-[#b70501] transition text-lg shadow">
                <FaFacebookF />
              </a>
              <a href="#" className="bg-[#b70501] text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:text-[#b70501] transition text-lg shadow">
                <FaInstagram />
              </a>
              <a href="#" className="bg-[#b70501] text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:text-[#b70501] transition text-lg shadow">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* روابط سريعة */}
          <div className="flex-1 flex flex-col items-center md:items-start mb-8 md:mb-0">
            <h3 className="text-xl font-bold mb-4 text-[#b70501]">{t('quickLinksTitle')}</h3>
            <ul className="flex flex-col md:flex-row md:gap-6 gap-2 text-base font-medium text-white/90 items-center md:items-start">
              <li><Link href="/" className="hover:text-[#b70501] transition">{t('home')}</Link></li>
              <li><Link href="/units" className="hover:text-[#b70501] transition">{t('properties')}</Link></li>
              <li><Link href="/about_us" className="hover:text-[#b70501] transition">{t('about')}</Link></li>
              <li><Link href="/contact_us" className="hover:text-[#b70501] transition">{t('contact')}</Link></li>
            </ul>
          </div>

          {/* معلومات التواصل */}
          <div className="flex-1 flex flex-col items-center md:items-start">
            <h3 className="text-xl font-bold mb-4 text-[#b70501]">{t('contactTitle')}</h3>
            <ul className="space-y-3 text-base font-medium text-white/90">
              <li className="flex items-start gap-2"><span className="mt-1"></span><span><strong className="text-white">{t('addressLabel')}</strong> شارع المليونير، برج الألماس، الدور 99، مدينة الأحلام، محافظة الخيال</span></li>
              <li className="flex items-center gap-2"><span></span><span><strong className="text-white">{t('emailLabel')}</strong> info@fake-realestate-spam.com</span></li>
              <li className="flex items-center gap-2"><span></span><span><strong className="text-white">{t('mobileLabel')}</strong> +20 111 199 3383</span></li>
              <li className="flex items-center gap-2"><span></span><span><strong className="text-white">{t('phoneLabel')}</strong> +20 111 199 3383</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-4 flex flex-col md:flex-row justify-between items-center text-xs text-white/60 px-4 gap-2">
          <p>
            &copy; {year} <Link href="https://www.rockaidev.com" className="font-bold text-[#b70501]">Rockai Dev</Link> | {t('allRightsReserved')}.
          </p>
          <div className="flex gap-4">
            <Link className="hover:text-[#b70501] font-semibold" href="/">{t('termsConditions')}</Link>
            <Link className="hover:text-[#b70501] font-semibold" href="/">{t('privacyPolicy')}</Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
