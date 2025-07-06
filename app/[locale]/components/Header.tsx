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
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#b70501] px-4 pb-4 overflow-hidden"
          >
            <motion.div
              variants={navContainer}
              initial="hidden"
              animate="show"
            >
              {navLinks.map((link) => (
                <motion.div key={link.href} variants={navItem}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block text-white py-2 border-b border-neutral-300 transition-all duration-300 ease-in-out ${pathname === link.href ? 'text-black font-bold' : ''
                      }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile Lang Changer */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-3"
            >
              <LangChanger />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
