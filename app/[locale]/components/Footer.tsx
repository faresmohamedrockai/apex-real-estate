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
    <footer className="bg-neutral-900 text-white pt-12 pb-6 border-t-4 border-[#b70501]">
      {/* ✅ المحتوى الرئيسي */}
      <div className="w-full px-4 flex flex-col md:flex-row items-start justify-around gap-y-6 md:gap-y-0">

        {/* تعريف الشركة */}
        <div className="flex flex-col items-center md:items-start max-w-xs text-center md:text-start">
          <Image
            src="/red.logo.jpg"
            alt="Apex Logo"
            width={100}
            height={100}
            className="rounded-full object-cover border-2 shadow-md mb-4"
          />
          <p className="text-white/80 text-sm font-medium leading-relaxed">
            {t('companyDescription')}
          </p>
          <div className="flex gap-3 mt-6">
            <a
              href="https://www.facebook.com/people/Apex-Real-Estate-Investment/61567153032479/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#b70501] text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:text-[#b70501] transition text-lg shadow"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="bg-[#b70501] text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:text-[#b70501] transition text-lg shadow"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="bg-[#b70501] text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:text-[#b70501] transition text-lg shadow"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* روابط سريعة */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-bold mb-4 text-[#b70501]">{t('quickLinksTitle')}</h3>
          <ul className="flex flex-col gap-2 md:gap-3 text-sm font-medium text-white/90 items-center md:items-start">
            <li><Link href="/" className="hover:text-[#b70501] transition">{t('home')}</Link></li>
            <li><Link href="/units" className="hover:text-[#b70501] transition">{t('properties')}</Link></li>
            <li><Link href="/about_us" className="hover:text-[#b70501] transition">{t('about')}</Link></li>
            <li><Link href="/contact_us" className="hover:text-[#b70501] transition">{t('contact')}</Link></li>
          </ul>
        </div>

        {/* معلومات التواصل */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-bold mb-4 text-[#b70501]">{t('contactTitle')}</h3>
          <ul className="space-y-2 text-sm font-medium text-white/90 text-center md:text-start">
            <li className="text-xs"><strong className="text-white">{t('addressLabel')}</strong> {t('addAs')}</li>
            <li className="text-xs"><strong className="text-white">{t('emailLabel')}</strong> info@fake-realestate-spam.com</li>
            <li className="text-xs"><strong className="text-white">{t('mobileLabel')}</strong> +20 111 199 3383</li>
            <li className="text-xs"><strong className="text-white">{t('phoneLabel')}</strong> +20 111 199 3383</li>
          </ul>
        </div>
      </div>

      {/* ✅ حقوق النشر */}
      <div className="mt-8 border-t border-white/10 pt-4 flex flex-col md:flex-row justify-around items-center text-xs text-white/60 px-4 gap-2">
        <p>
          &copy; {year} <Link href="https://www.rockaidev.com" className="font-bold text-[#b70501]">Rockai Dev</Link> | {t('allRightsReserved')}.
        </p>
        <div className="flex gap-4">
          <Link className="hover:text-[#b70501] font-semibold text-xs" href="/">{t('termsConditions')}</Link>
          <Link className="hover:text-[#b70501] font-semibold text-xs" href="/">{t('privacyPolicy')}</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
