'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import LangChanger from './langChanger';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('navigation');

  const navLinks = [
    { label: t('home'), href: '/' },
    { label: t('search'), href: '/search' },
    { label: t('developers'), href: '/developers' },
    { label: t('zones'), href: '/zones' },
    { label: t('projects'), href: '/projects' },
    { label: t('units'), href: '/units' },
    { label: t('about'), href: '/about_us' },
    { label: t('contact'), href: '/contact_us' },
  ];

  const navContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 1.2,
        duration: 2,
      },
    },
  };

  const navItem = {
    hidden: { opacity: 0, x: -50 },
    show: { opacity: 1, x: 50 },
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent min-h-[60px] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center">
        <motion.div
          key={pathname + '-logo'}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center rtl:flex-row-reverse gap-4"
        >
          <Link
            href="/"
            className="flex items-center hover:opacity-90 space-x-0 transition-all duration-300"
          >
            <div className="h-[80px] flex items-center">
              <Image
                src="/logo.jpg"
                alt="APEX Logo"
                width={150}
                height={120}
                className="object-contain"
              />
            </div>
          </Link>
        </motion.div>

        <motion.nav
          key={pathname + '-nav'}
          className="hidden md:flex space-x-4 rtl:space-x-reverse"
          variants={navContainer}
          initial="hidden"
          animate="show"
        >
          {navLinks.map((link) => (
            <motion.div key={link.href} variants={navItem}>
              <Link
                href={link.href}
                className={`relative text-[#efe6e7] hover:text-red-600 hover:underline-offset-2 px-3 py-2 transition-all duration-300 ease-in-out ${
                  pathname === link.href ? 'text-black font-bold' : ''
                }`}
              >
                <span className="relative z-10 font-bold">{link.label}</span>
              </Link>
            </motion.div>
          ))}
        </motion.nav>

        <motion.div
          key={pathname + '-lang'}
          className="hidden md:block"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <LangChanger />
        </motion.div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#b70501] px-4 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block text-white py-2 border-b border-neutral-300 transition-all duration-300 ease-in-out ${
                pathname === link.href ? 'text-black font-bold' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3">
            <LangChanger />
          </div>
        </div>
      )}
    </header>
  );
}
