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
      {/* ✅ الفوتر الرئيسي */}
      <footer className="bg-[#b70501] text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 items-stretch text-lg leading-relaxed">

          {/* 👇 تعريف الشركة مع اللوجو */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <Image
                  src="/red.logo.jpg"
                  alt="Apex Logo"
                  width={180}
                  height={180}
                  className="rounded-full object-cover border-4 shadow-lg"
                />
              </div>
              <p className="text-white/90 text-base font-medium">
                {t('companyDescription')}
              </p>
            </div>

            <div className="flex space-x-4 mt-6">
              <a
                href="https://www.facebook.com/people/Apex-Real-Estate-Investment/61567153032479/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[#b70501] w-12 h-12 flex items-center justify-center rounded-full hover:scale-110 transition text-xl"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="bg-white text-[#b70501] w-12 h-12 flex items-center justify-center rounded-full hover:scale-110 transition text-xl"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="bg-white text-[#b70501] w-12 h-12 flex items-center justify-center rounded-full hover:scale-110 transition text-xl"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* 👇 روابط سريعة */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-extrabold mb-6">{t('quickLinksTitle')}</h3>
              <ul className="space-y-4 text-base font-medium text-white/90">
                <li><a href="/" className="hover:underline">{t('home')}</a></li>
                <li><a href="/properties" className="hover:underline">{t('properties')}</a></li>
                <li><a href="/about_us" className="hover:underline">{t('about')}</a></li>
                <li><a href="/contact_us" className="hover:underline">{t('contact')}</a></li>
              </ul>
            </div>
          </div>

          {/* 👇 معلومات التواصل */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-extrabold mb-6">{t('contactTitle')}</h3>
              <ul className="space-y-4 text-base font-medium text-white/90">
                <li>
                  <strong className="text-white">{t('addressLabel')}:</strong><br />
                  {t('address')}
                </li>
                <li>
                  <strong className="text-white">{t('emailLabel')}:</strong> info@apex-realestate.com
                </li>
                <li>
                  <strong className="text-white">{t('mobileLabel')}:</strong> 01111993383
                </li>
                <li>
                  <strong className="text-white">{t('phoneLabel')}:</strong> 03/4214224
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* ✅ الفوتر السفلي الثابت */}
      <footer className="flex flex-wrap justify-around items-center w-full p-2 bg-gray-200 text-bgColor">
        <p className="text-sm mb-1">
          Copyright <sup>&copy;</sup> {year}{' '}
          <Link href="https://www.rockaidev.com" className="font-bold text-blue-500">
            Rockai Dev
          </Link>{' '}
          | All Rights Reserved.
        </p>
        <p className="text-sm">
          <Link className="px-2 font-semibold" href="/">
            Terms & Conditions
          </Link>
          <Link className="px-2 font-semibold" href="/">
            Privacy Policy
          </Link>
        </p>
      </footer>
    </>
  );
};

export default Footer;
