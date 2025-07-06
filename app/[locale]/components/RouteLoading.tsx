'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Loading from './loading/loading';

const RouteLoading = () => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== currentPath) {
      setIsLoading(true);
      setCurrentPath(pathname);
      
      // إخفاء loading بعد فترة قصيرة
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [pathname, currentPath]);

  return <Loading isLoading={isLoading} />;
};

export default RouteLoading; 