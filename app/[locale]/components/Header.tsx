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
                src="/logo.png"
                alt="APEX Logo"
                width={150}
                height={150}
                className="object-contain"
              />
            </div>
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <motion.nav
          key={pathname + '-nav'}
          className="hidden md:flex space-x-4 rtl:space-x-reverse mt-8"
          variants={navContainer}
          initial="hidden"
          animate="show"
        >
          {navLinks.map((link) => (
            <motion.div key={link.href} variants={navItem} >
              <Link
                href={link.href}
                className={`relative text-[#efe6e7] text-lg md:text-xl mt-9 hover:text-white hover:rounded-3xl hover:p-4 hover:bg-[#b70501] hover:underline-offset-2 px-3 py-2 transition-all duration-300 ease-in-out ${pathname === link.href ? 'text-black font-bold' : ''
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
                <svg xmlns="http://www.w3.org/2000/svg" width="23.178" height="23.178" viewBox="0 0 23.178 23.178">
                  <path id="Icon_awesome-phone-alt" data-name="Icon awesome-phone-alt" d="M22.517,16.379l-5.07-2.173a1.086,1.086,0,0,0-1.268.312l-2.245,2.743A16.78,16.78,0,0,1,5.912,9.24L8.656,6.995a1.084,1.084,0,0,0,.312-1.268L6.795.657A1.094,1.094,0,0,0,5.55.028L.842,1.114A1.086,1.086,0,0,0,0,2.173,21,21,0,0,0,21.005,23.178a1.086,1.086,0,0,0,1.059-.842l1.086-4.708a1.1,1.1,0,0,0-.634-1.249Z" transform="translate(0 0)" fill="#fff" />
                </svg>
              </Link>
              <Link
                href="https://www.facebook.com/people/Apex-Real-Estate-Investment/61567153032479/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1877F3] text-white w-14 h-14 flex items-center justify-center rounded-full hover:bg-white hover:text-[#1877F3] transition-all duration-300 shadow-lg hover:scale-110"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 320 512">
                  <path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91V127.91c0-25.35 12.42-50.06 52.24-50.06H293V6.26S259.5 0 225.36 0c-73.22 0-121.09 44.38-121.09 124.72v70.62H22.89V288h81.38v224h100.2V288z" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>


        )}
      </AnimatePresence>
    </header>
  );
}
