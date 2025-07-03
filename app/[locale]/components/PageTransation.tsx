'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function TransitionOverlay({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timeout = setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>

      <div className={`transition-all duration-300 ${isTransitioning ? 'blur-sm scale-[0.98] opacity-80' : ''}`}>
        {children}
      </div>

      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="overlay"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            className="fixed inset-0 bg-[#b70501] z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </>
  );
}
