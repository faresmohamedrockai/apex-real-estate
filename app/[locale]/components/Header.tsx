'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import LangChanger from './langChanger';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('navigation');

  const navLinks = [
    { label: t('home'), href: '/' },
    { label: t('search'), href: '/search' },
    { label: t('developers'), href: '/developers' },
    // { label: t('projects'), href: '/projects' },
    // { label: t('units'), href: '/units' },
    { label: t('about'), href: '/about_us' },
    { label: t('contact'), href: '/contact_us' },
  ];

  const navContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.6,
      },
    },
  };

  const navItem = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent min-h-[60px] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center">
        {/* Logo */}
        <motion.div
          key={pathname + '-logo'}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center rtl:flex-row-reverse gap-4"
        >
          <Link href="/" className="flex items-center hover:opacity-90 transition-all duration-300">
            <div className="h-[80px] flex items-center">
              <Image
                src="/logo.jpg"
                alt="APEX Logo"
                width={200}
                height={200}
                className="object-contain"
              />
            </div>
          </Link>
        </motion.div>

        {/* Desktop Nav */}
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
                className={`relative text-[#efe6e7] hover:text-red-600 hover:underline-offset-2 px-3 py-2 transition-all duration-300 ease-in-out ${pathname === link.href ? 'text-black font-bold' : ''
                  }`}
              >
                <span className="relative z-10 font-bold">{link.label}</span>
              </Link>
            </motion.div>
          ))}
        </motion.nav>

        {/* Lang Changer */}
        <motion.div
          key={pathname + '-lang'}
          className="hidden md:block"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <LangChanger />
        </motion.div>

        {/* Mobile Menu Toggle */}
        <div className='bg-[#b70501] rounded-lg p-2 md:hidden'><button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 group focus:outline-none"
          aria-label="Toggle menu"
        >
          <span className="sr-only">Open main menu</span>
          <span
            className={`block h-0.5 w-7 my-1 rounded-full bg-white transition-all duration-300
              ${isOpen ? 'rotate-45 translate-y-2' : ''}`}
          ></span>
          <span
            className={`block h-0.5 w-7 my-1 rounded-full bg-white transition-all duration-300
              ${isOpen ? 'opacity-0' : ''}`}
          ></span>
          <span
            className={`block h-0.5 w-7 my-1 rounded-full bg-white transition-all duration-300
              ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}
          ></span>
        </button></div>

      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 0.95 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="md:hidden fixed inset-0 bg-neutral-900 z-40 flex flex-col justify-center items-center"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-white text-3xl hover:text-[#b70501] transition-colors duration-300"
              aria-label="Close menu"
            >
              ✕
            </button>
            <motion.div
              variants={navContainer}
              initial="hidden"
              animate="show"
              className="text-center"
            >
              {navLinks.map((link) => (
                <motion.div key={link.href} variants={navItem} className="mb-6">
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block text-white text-2xl font-bold py-4 transition-all duration-300 ease-in-out hover:text-[#b70501] ${pathname === link.href ? 'text-[#b70501] underline underline-offset-4' : ''}`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              
              {/* Social Media Icons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-8 flex gap-6 justify-center"
              >
                <Link
                  href="https://wa.me/201111993383"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white w-14 h-14 flex items-center justify-center rounded-full hover:bg-white hover:text-[#25D366] transition-all duration-300 shadow-lg hover:scale-110"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 448 512">
                    <path fill="currentColor" d="M380.9 97.1C339-3.6 225.9-35.3 125.1 6.5 24.3 48.3-7.4 161.4 34.4 262.2c33.2 77.2 108.1 126.2 191.2 126.2 23.2 0 46.2-3.7 68.2-11.1l61.1 16.1c7.6 2 15.6-1.1 19.6-7.7 4-6.6 2.7-15.1-3.1-20.2l-44.2-38.7c-2.7-2.4-6.2-3.7-9.8-3.7-1.7 0-3.4.3-5 .9-19.2 7.2-39.6 10.8-60.1 10.8-70.7 0-128.2-57.5-128.2-128.2 0-70.7 57.5-128.2 128.2-128.2 70.7 0 128.2 57.5 128.2 128.2 0 20.5-3.6 40.9-10.8 60.1-.6 1.6-.9 3.3-.9 5 0 3.6 1.3 7.1 3.7 9.8l38.7 44.2c5.1 5.8 13.6 7.1 20.2 3.1 6.6-4 9.7-12 7.7-19.6l-16.1-61.1c7.4-22 11.1-45 11.1-68.2 0-83.1-49-158-126.2-191.2z"/>
                  </svg>
                </Link>
                <Link
                  href="https://www.facebook.com/people/Apex-Real-Estate-Investment/61567153032479/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1877F3] text-white w-14 h-14 flex items-center justify-center rounded-full hover:bg-white hover:text-[#1877F3] transition-all duration-300 shadow-lg hover:scale-110"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 320 512">
                    <path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91V127.91c0-25.35 12.42-50.06 52.24-50.06H293V6.26S259.5 0 225.36 0c-73.22 0-121.09 44.38-121.09 124.72v70.62H22.89V288h81.38v224h100.2V288z"/>
                  </svg>
                </Link>
              </motion.div>
            </motion.div>

            {/* Mobile Lang Changer */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="mt-6"
            >
              <LangChanger />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
